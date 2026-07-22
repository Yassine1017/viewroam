import kaminarimonRaw from "../../content/shot-guides/kaminarimon-at-night.json";
import rainbowBridgeRaw from "../../content/shot-guides/rainbow-bridge-from-odaiba.json";
import shibuyaRaw from "../../content/shot-guides/shibuya-crossing-at-night.json";
import skytreeRaw from "../../content/shot-guides/tokyo-skytree-from-sumida-park.json";
import tokyoTowerRaw from "../../content/shot-guides/tokyo-tower-from-zojoji.json";
import type { ShotGuide } from "../types/shotGuide";

export const shotGuides = [
  tokyoTowerRaw,
  kaminarimonRaw,
  shibuyaRaw,
  skytreeRaw,
  rainbowBridgeRaw,
] as ShotGuide[];

export const defaultShotGuide = shotGuides[0];
