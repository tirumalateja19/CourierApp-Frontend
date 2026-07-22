const STAGES = [
  { key: "Created", label: "Created" },
  { key: "Assigned", label: "Assigned" },
  { key: "PickedUp", label: "Picked up" },
  { key: "Dispatched", label: "Dispatched" },
];

const STAGE_INDEX = {
  Created: 0,
  Assigned: 1,
  PickedUp: 2,
  AtOffice: 2,
  Dispatched: 3,
};

const JobTimeline = ({ status }) => {
  const currentIndex = STAGE_INDEX[status] ?? 0;

  return (
    <div className="flex flex-col">
      {STAGES.map((stage, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === STAGES.length - 1;

        return (
          <div key={stage.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`size-2.5 rounded-full ${
                  isComplete || isCurrent ? "bg-black" : "bg-gray-300"
                }`}
              />
              {!isLast && (
                <div
                  className={`w-px flex-1 min-h-7 ${
                    isComplete ? "bg-black" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <p
              className={`text-sm pb-6 ${
                isComplete || isCurrent
                  ? "font-medium text-black"
                  : "text-gray-400"
              }`}
            >
              {stage.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default JobTimeline;
