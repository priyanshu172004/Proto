export type ResearchProject = {
  id: string;
  title: string;
  /**
   * Intentionally optional and intentionally empty.
   * Descriptions are pending from the author — nothing here is inferred.
   * Fill these in and the cards pick them up with no layout change.
   */
  description?: string;
};

export const research: ResearchProject[] = [
  { id: "iot-vector-attacks", title: "IOT_VECTOR ATTACKS" },
  { id: "myct", title: "MYCT" },
  { id: "deepfake-ml-analysis", title: "DEEPFAKE ML ANALYSIS" },
  { id: "computer-vision-tce", title: "COMPUTER VISION_TCE" },
  { id: "fedtwin", title: "FEDTWIN" },
];
