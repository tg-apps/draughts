import { Piece } from "#game/piece";
import { describe, expect, it } from "bun:test";

describe("Piece", () => {
  describe("new Piece", () => {
    it("should create an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.type).toBe("empty");
    });

    it("should create a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.type).toBe("piece");
      expect(piece.color).toBe("white");
      expect(piece.variant).toBe("default");
    });
  });

  describe("Piece.label", () => {
    it("should handle an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.label).toBe("EMPTY");
    });

    it("should handle a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.label).toBe("WHITE");
    });
  });

  describe("Piece.toString", () => {
    it("should handle an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.toString()).toBeString();
    });

    it("should handle a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.toString()).toBeString();
    });
  });

  describe("Piece.isEmpty", () => {
    it("should handle an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.isEmpty()).toBeTrue();
    });

    it("should handle a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.isEmpty()).toBeFalse();
    });
  });

  describe("Piece.fromLabel", () => {
    it("should create an empty piece", () => {
      const piece = Piece.fromLabel("EMPTY");
      expect(piece.type).toBe("empty");
    });

    it("should create a white piece", () => {
      const piece = Piece.fromLabel("WHITE");
      expect(piece.type).toBe("piece");
      expect(piece.color).toBe("white");
      expect(piece.variant).toBe("default");
    });
  });
});
