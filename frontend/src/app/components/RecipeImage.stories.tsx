import type { Meta, StoryObj } from "@storybook/react";
import RecipeImage from "./RecipeImage";

const meta: Meta<typeof RecipeImage> = {
  title: "Components/RecipeImage",
  component: RecipeImage,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof RecipeImage>;

export const Default: Story = {
  args: {
    src: "/images/heroImageLandingPage.jpg",
    alt: "Exempelrecept",
    className: "h-56 w-80 rounded-lg object-cover",
  },
};

export const Fallback: Story = {
  args: {
    src: "",
    alt: "Saknad bild",
    className: "h-56 w-80 rounded-lg object-cover",
  },
};
