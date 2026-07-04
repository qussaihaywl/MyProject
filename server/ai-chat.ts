import { invokeLLM, Message } from "./_core/llm";

/**
 * نظام AI متقدم للدردشة مع معالجة طبيعية
 * يوفر ردود ذكية وسياقية للعملاء
 */

interface ChatContext {
  userId: string;
  userName: string;
  userRole?: string;
  conversationHistory: Message[];
  productContext?: {
    productId: number;
    productName: string;
    price: number;
    category: string;
  };
}

interface AIResponse {
  text: string;
  suggestions?: string[];
  actionType?: "info" | "product" | "order" | "support";
  actionData?: Record<string, unknown>;
}

/**
 * نظام الأسئلة الشائعة والاقتراحات
 */
const FAQ_SUGGESTIONS = {
  greeting: [
    "ما هي فئات المنتجات المتاحة؟",
    "كيف يمكنني تتبع طلبي؟",
    "ما هي سياسة الإرجاع؟",
  ],
  product: [
    "هل المنتج متوفر بألوان أخرى؟",
    "ما هي المقاسات المتاحة؟",
    "كم سعر الشحن؟",
  ],
  order: [
    "كيف يمكنني إرجاع المنتج؟",
    "ما هو وقت التوصيل المتوقع؟",
    "هل تقبلون الدفع عند الاستلام؟",
  ],
  payment: [
    "ما هي طرق الدفع المتاحة؟",
    "هل الموقع آمن للدفع؟",
    "هل هناك خصومات متاحة؟",
  ],
};

/**
 * نظام معالجة الكلمات المفتاحية
 */
const KEYWORD_PATTERNS = {
  greeting: /^(مرحبا|السلام|صباح|مساء|كيف|أهلا)/i,
  product: /(منتج|سعر|لون|مقاس|صورة|وصف)/i,
  order: /(طلب|شراء|سلة|دفع|فاتورة)/i,
  shipping: /(شحن|توصيل|عنوان|سرعة)/i,
  return: /(إرجاع|استبدال|استرجاع|مشكلة|عيب)/i,
  payment: /(دفع|بطاقة|محفظة|تحويل|ضمان)/i,
  support: /(مساعدة|مشكلة|خطأ|شكوى|دعم)/i,
};

/**
 * دالة تحديد نوع السؤال
 */
function detectQuestionType(message: string): string {
  for (const [type, pattern] of Object.entries(KEYWORD_PATTERNS)) {
    if (pattern.test(message)) {
      return type;
    }
  }
  return "general";
}

/**
 * دالة الحصول على الاقتراحات المناسبة
 */
function getSuggestions(questionType: string): string[] {
  const suggestions =
    FAQ_SUGGESTIONS[questionType as keyof typeof FAQ_SUGGESTIONS] ||
    FAQ_SUGGESTIONS.greeting;
  return suggestions;
}

/**
 * نظام البناء الديناميكي للرسالة النظامية
 */
function buildSystemPrompt(context: ChatContext): string {
  const basePrompt = `أنت مساعد ذكي لمتجر Rose Online - متجر متخصص في بيع الملابس والأثاث والإكسسوارات.

**معلومات عنك:**
- اسمك: روز (Rose)
- دورك: مساعد عملاء ذكي ودود
- اللغة: العربية فقط
- الأسلوب: احترافي وودود وسريع الاستجابة

**قواعد التفاعل:**
1. رحب بالعميل باحترافية وودية
2. اسأل عن احتياجاته بشكل واضح
3. قدم معلومات دقيقة عن المنتجات والخدمات
4. كن صبوراً وفهماً للعملاء
5. استخدم الرموز التعبيرية بحذر وبشكل احترافي
6. لا تعطِ معلومات غير صحيحة
7. إذا لم تعرف الإجابة، اعترف بذلك وقدم بديلاً

**فئات المنتجات:**
- ملابس: فساتين، قمصان، بنطلونات، سترات
- أثاث: أرائك، طاولات، كراسي، خزائن
- إكسسوارات: حقائب، أحذية، مجوهرات، ساعات

**خدمات متاحة:**
- توصيل سريع في جميع أنحاء الأردن
- إرجاع مجاني خلال 14 يوم
- دفع آمن بعدة طرق
- دعم عملاء 24/7
- ضمان على جميع المنتجات

${
  context.productContext
    ? `\n**السياق الحالي:**
- المنتج: ${context.productContext.productName}
- الفئة: ${context.productContext.category}
- السعر: ${context.productContext.price} دينار أردني`
    : ""
}`;

  return basePrompt;
}

/**
 * دالة إنشاء رد ذكي من AI
 */
export async function generateAIResponse(
  userMessage: string,
  context: ChatContext
): Promise<AIResponse> {
  try {
    // تحديد نوع السؤال
    const questionType = detectQuestionType(userMessage);

    // بناء السياق التاريخي
    const messages: Message[] = [
      {
        role: "system",
        content: buildSystemPrompt(context),
      },
      ...context.conversationHistory,
      {
        role: "user",
        content: userMessage,
      },
    ];

    // استدعاء LLM
    const response = await invokeLLM({
      messages,
      max_tokens: 1024,
    });

    // استخراج الرد
    const aiText =
      response.choices[0]?.message?.content || "عذراً، حدث خطأ في المعالجة";
    const textContent =
      typeof aiText === "string"
        ? aiText
        : Array.isArray(aiText)
          ? aiText
              .filter((c) => c.type === "text")
              .map((c) => (c as any).text)
              .join("\n")
          : String(aiText);

    // الحصول على الاقتراحات
    const suggestions = getSuggestions(questionType);

    return {
      text: textContent,
      suggestions,
      actionType: getActionType(questionType),
    };
  } catch (error) {
    console.error("خطأ في توليد الرد:", error);
    return {
      text: "عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة لاحقاً أو التواصل مع فريق الدعم.",
      suggestions: ["هل يمكنني مساعدتك بشيء آخر؟"],
    };
  }
}

/**
 * دالة تحديد نوع الإجراء المطلوب
 */
function getActionType(
  questionType: string
): "info" | "product" | "order" | "support" {
  const actionMap: Record<string, "info" | "product" | "order" | "support"> = {
    product: "product",
    order: "order",
    shipping: "order",
    return: "support",
    payment: "order",
    support: "support",
    greeting: "info",
    general: "info",
  };

  return actionMap[questionType] || "info";
}

/**
 * دالة تحليل المشاعر (Sentiment Analysis)
 */
export function analyzeSentiment(message: string): "positive" | "neutral" | "negative" {
  const positiveWords = /رائع|ممتاز|شكراً|أحب|مشكور|وفقك|بارك/i;
  const negativeWords = /سيء|مشكلة|غاضب|حزين|خطأ|مخيب|مزعج|سيء|قبيح/i;

  if (negativeWords.test(message)) {
    return "negative";
  }
  if (positiveWords.test(message)) {
    return "positive";
  }
  return "neutral";
}

/**
 * دالة توليد ملخص الدردشة
 */
export async function generateChatSummary(
  conversationHistory: Message[]
): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد متخصص في تلخيص المحادثات. قم بتلخيص المحادثة التالية بشكل مختصر وواضح باللغة العربية.",
        },
        ...conversationHistory,
        {
          role: "user",
          content:
            "يرجى تلخيص هذه المحادثة في 2-3 جمل قصيرة توضح الموضوع الرئيسي والنتيجة.",
        },
      ],
      max_tokens: 256,
    });

    const summary =
      response.choices[0]?.message?.content || "لا يمكن توليد ملخص";
    return typeof summary === "string"
      ? summary
      : Array.isArray(summary)
        ? summary
            .filter((c) => c.type === "text")
            .map((c) => (c as any).text)
            .join("\n")
        : String(summary);
  } catch (error) {
    console.error("خطأ في توليد الملخص:", error);
    return "حدث خطأ في توليد الملخص";
  }
}

/**
 * دالة الحصول على الأسئلة الشائعة
 */
export function getFrequentlyAskedQuestions(): Record<string, string[]> {
  return FAQ_SUGGESTIONS;
}
