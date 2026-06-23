import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["analyst", "viewer"]),
});

export const alertSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  ids_type: z.enum(["NIDS", "HIDS", "Hybrid"]),
  attack_category: z.string().min(1, "Select an attack category"),
});

export const metricSchema = z.object({
  ids_config_id: z.string().uuid(),
  metric_name: z.enum([
    "detection_accuracy",
    "false_positive_rate",
    "scalability_score",
    "resource_consumption",
    "deployment_complexity",
    "realtime_capability",
  ]),
  value: z.number().min(0).max(100),
  notes: z.string().optional(),
});

export const idsConfigSchema = z.object({
  name: z.string().min(2, "Name is required"),
  ids_type: z.enum(["NIDS", "HIDS", "Hybrid"]),
  description: z.string().optional(),
  deployment_scope: z.string().optional(),
});

export const attackTypeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  nids_rating: z.enum(["Low", "Medium", "High", "Very High"]),
  hids_rating: z.enum(["Low", "Medium", "High", "Very High"]),
  hybrid_rating: z.enum(["Low", "Medium", "High", "Very High"]),
});
