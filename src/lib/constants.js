export const IDS_TYPES = ["NIDS", "HIDS", "Hybrid"];

export const SEVERITY_LEVELS = ["low", "medium", "high", "critical"];

export const ALERT_STATUSES = ["open", "investigating", "resolved"];

export const METRIC_NAMES = [
  { value: "detection_accuracy", label: "Detection Accuracy" },
  { value: "false_positive_rate", label: "False Positive Rate" },
  { value: "scalability_score", label: "Scalability Score" },
  { value: "resource_consumption", label: "Resource Consumption" },
  { value: "deployment_complexity", label: "Deployment Complexity" },
  { value: "realtime_capability", label: "Real-time Capability" },
];

export const ARCHITECTURE_DATA = [
  {
    type: "NIDS",
    color: "cyan",
    coverage: "Network level",
    detectionStrength: "External attacks, DDoS, Port Scanning",
    limitation: "No visibility into individual host activities",
    description:
      "Monitors traffic across an entire network by analysing packets at strategic points such as routers and gateways.",
    detectionScore: 70,
  },
  {
    type: "HIDS",
    color: "green",
    coverage: "Host level",
    detectionStrength: "Insider threats, Malware, File integrity",
    limitation: "No global network view, limited scalability",
    description:
      "Operates on individual systems and monitors internal activities such as file changes, system logs, and process behaviour.",
    detectionScore: 65,
  },
  {
    type: "Hybrid IDS",
    color: "purple",
    coverage: "Network + Host",
    detectionStrength: "Broadest coverage across all attack types",
    limitation: "Higher computational overhead and deployment complexity",
    description:
      "Combines NIDS and HIDS to provide comprehensive detection across both network traffic and host-level activities.",
    detectionScore: 90,
  },
];

export const DETECTION_TECHNIQUES = [
  {
    name: "Signature-based Detection",
    howItWorks:
      "Compares observed activity against a database of known attack patterns or signatures to flag matches.",
    strengths: "Highly accurate for known threats with low false positive rates.",
    weaknesses: "Cannot detect novel or zero-day attacks not yet in the signature database.",
  },
  {
    name: "Anomaly-based Detection",
    howItWorks:
      "Builds a baseline of normal behaviour and flags significant deviations from that baseline as potential threats.",
    strengths: "Capable of detecting previously unseen attacks, including zero-day exploits.",
    weaknesses: "Prone to higher false positive rates if the normal baseline is not well established.",
  },
  {
    name: "Hybrid Detection",
    howItWorks:
      "Combines signature-based and anomaly-based techniques to leverage the strengths of both approaches.",
    strengths: "Broader detection coverage with improved accuracy across known and unknown threats.",
    weaknesses: "Increased complexity and resource requirements to run both detection engines.",
  },
];

// Static comparison reference data (from the report's architecture comparison),
// not live measurements — used for the Dashboard's NIDS vs HIDS vs Hybrid radar chart.
export const RADAR_COMPARISON_DATA = [
  { metric: "Detection Accuracy", NIDS: 70, HIDS: 65, Hybrid: 90 },
  { metric: "Scalability", NIDS: 75, HIDS: 50, Hybrid: 70 },
  { metric: "Resource Use", NIDS: 65, HIDS: 70, Hybrid: 55 },
  { metric: "False Positive Rate", NIDS: 60, HIDS: 65, Hybrid: 75 },
  { metric: "Real-time Capability", NIDS: 80, HIDS: 55, Hybrid: 75 },
];
