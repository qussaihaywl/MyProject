import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the ENV module
vi.mock("./_core/env", () => ({
  ENV: {
    forgeApiUrl: "https://forge.example.com",
    forgeApiKey: "test-forge-key",
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock crypto.randomUUID
vi.stubGlobal("crypto", {
  randomUUID: () => "12345678-abcd-efgh-ijkl-123456789abc",
});

describe("Storage Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("storageGet", () => {
    it("should return normalized key and URL", async () => {
      const { storageGet } = await import("./storage");
      const result = await storageGet("images/photo.jpg");

      expect(result.key).toBe("images/photo.jpg");
      expect(result.url).toBe("/manus-storage/images/photo.jpg");
    });

    it("should strip leading slashes from key", async () => {
      const { storageGet } = await import("./storage");
      const result = await storageGet("///images/photo.jpg");

      expect(result.key).toBe("images/photo.jpg");
      expect(result.url).toBe("/manus-storage/images/photo.jpg");
    });
  });

  describe("storagePut", () => {
    it("should upload file via presigned URL", async () => {
      // Mock presign response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://s3.example.com/presigned-url" }),
      });
      // Mock S3 upload response
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      const { storagePut } = await import("./storage");
      const result = await storagePut(
        "products/image.jpg",
        Buffer.from("test-data"),
        "image/jpeg"
      );

      expect(result.key).toContain("products/image");
      expect(result.key).toContain(".jpg");
      expect(result.url).toContain("/manus-storage/");

      // Verify presign request
      expect(mockFetch).toHaveBeenCalledTimes(2);
      const presignCall = mockFetch.mock.calls[0];
      expect(presignCall[1].headers.Authorization).toBe(
        "Bearer test-forge-key"
      );

      // Verify S3 upload
      const uploadCall = mockFetch.mock.calls[1];
      expect(uploadCall[0]).toBe("https://s3.example.com/presigned-url");
      expect(uploadCall[1].method).toBe("PUT");
    });

    it("should append hash suffix to filename", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://s3.example.com/presigned" }),
      });
      mockFetch.mockResolvedValueOnce({ ok: true });

      const { storagePut } = await import("./storage");
      const result = await storagePut("test.png", Buffer.from("data"));

      // Should have hash suffix before extension
      expect(result.key).toMatch(/test_[a-f0-9]+\.png/);
    });

    it("should throw when presign request fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        text: async () => "Access denied",
      });

      const { storagePut } = await import("./storage");
      await expect(storagePut("test.jpg", Buffer.from("data"))).rejects.toThrow(
        "Storage presign failed (403)"
      );
    });

    it("should throw when S3 upload fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://s3.example.com/presigned" }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { storagePut } = await import("./storage");
      await expect(storagePut("test.jpg", Buffer.from("data"))).rejects.toThrow(
        "Storage upload to S3 failed (500)"
      );
    });

    it("should throw when presign returns empty URL", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "" }),
      });

      const { storagePut } = await import("./storage");
      await expect(storagePut("test.jpg", Buffer.from("data"))).rejects.toThrow(
        "Forge returned empty presign URL"
      );
    });

    it("should handle string data input", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: "https://s3.example.com/presigned" }),
      });
      mockFetch.mockResolvedValueOnce({ ok: true });

      const { storagePut } = await import("./storage");
      const result = await storagePut(
        "data.json",
        '{"key":"value"}',
        "application/json"
      );

      expect(result.key).toContain("data");
      expect(result.url).toContain("/manus-storage/");
    });
  });

  describe("storageGetSignedUrl", () => {
    it("should return signed URL from Forge", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          url: "https://s3.example.com/signed-url?token=abc",
        }),
      });

      const { storageGetSignedUrl } = await import("./storage");
      const url = await storageGetSignedUrl("images/photo.jpg");

      expect(url).toBe("https://s3.example.com/signed-url?token=abc");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const call = mockFetch.mock.calls[0];
      expect(call[1].headers.Authorization).toBe("Bearer test-forge-key");
    });

    it("should throw when signed URL request fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () => "File not found",
      });

      const { storageGetSignedUrl } = await import("./storage");
      await expect(storageGetSignedUrl("nonexistent.jpg")).rejects.toThrow(
        "Storage signed URL failed (404)"
      );
    });
  });

  describe("getForgeConfig", () => {
    it("should throw when env vars are missing", async () => {
      // Re-mock with missing values
      vi.doMock("./_core/env", () => ({
        ENV: {
          forgeApiUrl: "",
          forgeApiKey: "",
        },
      }));

      // Force re-import
      vi.resetModules();
      const { storagePut } = await import("./storage");
      await expect(storagePut("test.jpg", Buffer.from("data"))).rejects.toThrow(
        "Storage config missing"
      );
    });
  });
});
