import { ArrayPropertyValues } from "@/utils/typeUtils";
import AIFile from "../assets/svg/ai-file.svg";
import ColorPalette from "../assets/svg/color-palette.svg";
import Folder from "../assets/svg/folder.svg";

export const EditorTabs = [
  {
    name: "colorPicker",
    icon: ColorPalette,
  },
  {
    name: "filePicker",
    icon: Folder,
  },
  {
    name: "aiPicker",
    icon: AIFile,
  },
] as const;

export type EditorTabNames = ArrayPropertyValues<typeof EditorTabs, "name">;
