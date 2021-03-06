import { AllTechVariants, variantPrinters } from "@/tech/TechMetadata";
import { unreachable } from "@/utils";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class extends Vue {
  get isInPlaceJump(): boolean {
    return this.getVariant().jumpDistance === "0.0";
  }

  get jumpDirection(): string {
    const { jumpDistance } = this.getVariant();
    switch (jumpDistance) {
      case "0.0":
        return "in-place";
      case "0.5":
      case "1.0":
      case "1.5":
      case "2.0":
      case "2.5":
      case "max":
        return `forward ${this.jumpDistancePretty}`;
      default:
        return unreachable(jumpDistance, "jumpDistance check is exhaustive");
    }
  }

  get jumpInputs(): string {
    const { jumpDistance } = this.getVariant();
    switch (jumpDistance) {
      case "0.0":
        return "sh";
      case "0.5":
      case "1.0":
      case "1.5":
      case "2.0":
      case "2.5":
        return "sh r";
      case "max":
        return "sh R";
      default:
        return unreachable(jumpDistance, "jumpDistance check is exhaustive");
    }
  }

  get jumpDistancePretty(): string {
    return variantPrinters.jumpDistance(this.getVariant().jumpDistance);
  }

  private getVariant(): AllTechVariants {
    // @ts-ignore
    const variant = this.variant;
    return variant as AllTechVariants;
  }
}
