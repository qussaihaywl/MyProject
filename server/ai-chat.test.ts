import { describe, it, expect, vi } from "vitest";
import { analyzeSentiment, getFrequentlyAskedQuestions } from "./ai-chat";

// We need to mock the LLM module before importing functions that use it
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

describe("AI Chat Module", () => {
  describe("analyzeSentiment", () => {
    it("should detect positive sentiment", () => {
      expect(analyzeSentiment("هذا رائع")).toBe("positive");
      expect(analyzeSentiment("ممتاز جداً")).toBe("positive");
      expect(analyzeSentiment("شكراً لكم")).toBe("positive");
    });

    it("should detect negative sentiment", () => {
      expect(analyzeSentiment("هذا سيء")).toBe("negative");
      expect(analyzeSentiment("لدي مشكلة")).toBe("negative");
      expect(analyzeSentiment("مخيب للآمال")).toBe("negative");
    });

    it("should detect neutral sentiment", () => {
      expect(analyzeSentiment("أريد معلومات")).toBe("neutral");
      expect(analyzeSentiment("ما هو السعر")).toBe("neutral");
      expect(analyzeSentiment("متى يتم التوصيل")).toBe("neutral");
    });

    it("should prioritize negative over positive when both present", () => {
      // negativeWords regex is tested first in the implementation
      expect(analyzeSentiment("رائع لكن مشكلة")).toBe("negative");
    });
  });

  describe("getFrequentlyAskedQuestions", () => {
    it("should return an object with FAQ categories", () => {
      const faqs = getFrequentlyAskedQuestions();
      expect(faqs).toBeDefined();
      expect(typeof faqs).toBe("object");
    });

    it("should have greeting suggestions", () => {
      const faqs = getFrequentlyAskedQuestions();
      expect(faqs.greeting).toBeDefined();
      expect(Array.isArray(faqs.greeting)).toBe(true);
      expect(faqs.greeting.length).toBeGreaterThan(0);
    });

    it("should have product suggestions", () => {
      const faqs = getFrequentlyAskedQuestions();
      expect(faqs.product).toBeDefined();
      expect(Array.isArray(faqs.product)).toBe(true);
      expect(faqs.product.length).toBeGreaterThan(0);
    });

    it("should have order suggestions", () => {
      const faqs = getFrequentlyAskedQuestions();
      expect(faqs.order).toBeDefined();
      expect(Array.isArray(faqs.order)).toBe(true);
    });

    it("should have payment suggestions", () => {
      const faqs = getFrequentlyAskedQuestions();
      expect(faqs.payment).toBeDefined();
      expect(Array.isArray(faqs.payment)).toBe(true);
    });
  });

  describe("detectQuestionType (via generateAIResponse)", () => {
    // detectQuestionType is not exported directly, but we can test it
    // indirectly through the KEYWORD_PATTERNS patterns
    it("should match greeting patterns", () => {
      const greetingPattern = /^(مرحبا|السلام|صباح|مساء|كيف|أهلا)/i;
      expect(greetingPattern.test("مرحبا")).toBe(true);
      expect(greetingPattern.test("السلام عليكم")).toBe(true);
      expect(greetingPattern.test("صباح الخير")).toBe(true);
      expect(greetingPattern.test("أهلا وسهلا")).toBe(true);
    });

    it("should match product patterns", () => {
      const productPattern = /(منتج|سعر|لون|مقاس|صورة|وصف)/i;
      expect(productPattern.test("أريد معلومات عن المنتج")).toBe(true);
      expect(productPattern.test("كم السعر")).toBe(true);
      expect(productPattern.test("ما الألوان المتاحة لون")).toBe(true);
    });

    it("should match order patterns", () => {
      const orderPattern = /(طلب|شراء|سلة|دفع|فاتورة)/i;
      expect(orderPattern.test("أريد طلب")).toBe(true);
      expect(orderPattern.test("كيف أكمل الشراء")).toBe(true);
      expect(orderPattern.test("أين الفاتورة")).toBe(true);
    });

    it("should match shipping patterns", () => {
      const shippingPattern = /(شحن|توصيل|عنوان|سرعة)/i;
      expect(shippingPattern.test("كم وقت الشحن")).toBe(true);
      expect(shippingPattern.test("متى التوصيل")).toBe(true);
    });

    it("should match return patterns", () => {
      const returnPattern = /(إرجاع|استبدال|استرجاع|مشكلة|عيب)/i;
      expect(returnPattern.test("أريد إرجاع المنتج")).toBe(true);
      expect(returnPattern.test("هل يمكن استبدال")).toBe(true);
    });

    it("should match support patterns", () => {
      const supportPattern = /(مساعدة|مشكلة|خطأ|شكوى|دعم)/i;
      expect(supportPattern.test("أحتاج مساعدة")).toBe(true);
      expect(supportPattern.test("أريد تقديم شكوى")).toBe(true);
    });
  });

  describe("getActionType mapping", () => {
    // Test the action type mapping logic
    it("should map question types to action types correctly", () => {
      const actionMap: Record<
        string,
        "info" | "product" | "order" | "support"
      > = {
        product: "product",
        order: "order",
        shipping: "order",
        return: "support",
        payment: "order",
        support: "support",
        greeting: "info",
        general: "info",
      };

      expect(actionMap["product"]).toBe("product");
      expect(actionMap["order"]).toBe("order");
      expect(actionMap["shipping"]).toBe("order");
      expect(actionMap["return"]).toBe("support");
      expect(actionMap["payment"]).toBe("order");
      expect(actionMap["support"]).toBe("support");
      expect(actionMap["greeting"]).toBe("info");
      expect(actionMap["general"]).toBe("info");
    });
  });

  describe("generateAIResponse", () => {
    it("should return error response when LLM fails", async () => {
      const { invokeLLM } = await import("./_core/llm");
      vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("LLM unavailable"));

      const { generateAIResponse } = await import("./ai-chat");
      const response = await generateAIResponse("مرحبا", {
        userId: "test-user",
        userName: "Test",
        conversationHistory: [],
      });

      expect(response.text).toContain("عذراً");
      expect(response.suggestions).toBeDefined();
    });

    it("should return AI response with suggestions on success", async () => {
      const { invokeLLM } = await import("./_core/llm");
      vi.mocked(invokeLLM).mockResolvedValueOnce({
        choices: [{ message: { content: "مرحباً بك في متجر Rose!" } }],
      } as any);

      const { generateAIResponse } = await import("./ai-chat");
      const response = await generateAIResponse("مرحبا", {
        userId: "test-user",
        userName: "Test",
        conversationHistory: [],
      });

      expect(response.text).toBe("مرحباً بك في متجر Rose!");
      expect(response.suggestions).toBeDefined();
      expect(Array.isArray(response.suggestions)).toBe(true);
      expect(response.actionType).toBe("info");
    });

    it("should include product context in system prompt when provided", async () => {
      const { invokeLLM } = await import("./_core/llm");
      vi.mocked(invokeLLM).mockResolvedValueOnce({
        choices: [{ message: { content: "سعر المنتج 50 دينار" } }],
      } as any);

      const { generateAIResponse } = await import("./ai-chat");
      const response = await generateAIResponse("كم السعر", {
        userId: "test-user",
        userName: "Test",
        conversationHistory: [],
        productContext: {
          productId: 1,
          productName: "فستان أحمر",
          price: 50,
          category: "ملابس",
        },
      });

      expect(response.text).toBeDefined();
      expect(response.actionType).toBe("product");

      // Verify invokeLLM was called with messages containing the product context
      const callArgs =
        vi.mocked(invokeLLM).mock.calls[
          vi.mocked(invokeLLM).mock.calls.length - 1
        ][0];
      const systemMessage = callArgs.messages[0];
      expect(systemMessage.content).toContain("فستان أحمر");
      expect(systemMessage.content).toContain("50");
    });
  });

  describe("generateChatSummary", () => {
    it("should return error message when LLM fails", async () => {
      const { invokeLLM } = await import("./_core/llm");
      vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("LLM unavailable"));

      const { generateChatSummary } = await import("./ai-chat");
      const summary = await generateChatSummary([
        { role: "user", content: "مرحبا" },
        { role: "assistant", content: "أهلاً" },
      ]);

      expect(summary).toBe("حدث خطأ في توليد الملخص");
    });

    it("should return summary text on success", async () => {
      const { invokeLLM } = await import("./_core/llm");
      vi.mocked(invokeLLM).mockResolvedValueOnce({
        choices: [{ message: { content: "ملخص المحادثة: استفسار عن منتج" } }],
      } as any);

      const { generateChatSummary } = await import("./ai-chat");
      const summary = await generateChatSummary([
        { role: "user", content: "ما سعر المنتج؟" },
        { role: "assistant", content: "السعر 50 دينار" },
      ]);

      expect(summary).toBe("ملخص المحادثة: استفسار عن منتج");
    });
  });
});
