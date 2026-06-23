import { useMemo } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/layout/PageWrapper";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import { ARCHITECTURE_DATA, DETECTION_TECHNIQUES } from "../lib/constants";

const COLOR_CLASSES = {
  cyan: { text: "text-cyan", bg: "bg-cyan/15", bar: "bg-cyan" },
  green: { text: "text-green", bg: "bg-green/15", bar: "bg-green" },
  purple: { text: "text-purple", bg: "bg-purple/15", bar: "bg-purple" },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function Architectures() {
  const columns = useMemo(
    () => [
      { header: "IDS Type", accessorKey: "type" },
      { header: "Coverage", accessorKey: "coverage" },
      { header: "Detection Strength", accessorKey: "detectionStrength" },
      { header: "Limitation", accessorKey: "limitation" },
    ],
    [],
  );

  return (
    <PageWrapper title="Architectures">
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {ARCHITECTURE_DATA.map((arch) => {
          const colors = COLOR_CLASSES[arch.color];
          return (
            <motion.div key={arch.type} variants={itemVariants}>
              <Card className="flex h-full flex-col">
                <span
                  className={`mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${colors.text} ${colors.bg}`}
                >
                  {arch.type}
                </span>
                <p className="mb-4 flex-1 text-sm text-text-muted">{arch.description}</p>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-text-primary">Coverage: </span>
                    <span className="text-text-muted">{arch.coverage}</span>
                  </p>
                  <p>
                    <span className="font-medium text-text-primary">Detection Strength: </span>
                    <span className="text-text-muted">{arch.detectionStrength}</span>
                  </p>
                  <p>
                    <span className="font-medium text-text-primary">Key Limitation: </span>
                    <span className="text-text-muted">{arch.limitation}</span>
                  </p>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-text-muted">
                    <span>Detection Capability</span>
                    <span>{arch.detectionScore}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${arch.detectionScore}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full rounded-full ${colors.bar}`}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <Card className="mb-6">
        <h3 className="mb-4 font-display text-base font-semibold text-text-primary">
          Architecture Comparison
        </h3>
        <Table columns={columns} data={ARCHITECTURE_DATA} pageSize={10} />
      </Card>

      <div>
        <h3 className="mb-4 font-display text-base font-semibold text-text-primary">
          Detection Techniques
        </h3>
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          {DETECTION_TECHNIQUES.map((technique) => (
            <motion.div key={technique.name} variants={itemVariants}>
              <Card className="h-full">
                <h4 className="mb-2 font-display text-sm font-semibold text-text-primary">
                  {technique.name}
                </h4>
                <p className="mb-3 text-sm text-text-muted">{technique.howItWorks}</p>
                <p className="mb-1 text-xs">
                  <span className="font-medium text-green">Strengths: </span>
                  <span className="text-text-muted">{technique.strengths}</span>
                </p>
                <p className="text-xs">
                  <span className="font-medium text-red">Weaknesses: </span>
                  <span className="text-text-muted">{technique.weaknesses}</span>
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
