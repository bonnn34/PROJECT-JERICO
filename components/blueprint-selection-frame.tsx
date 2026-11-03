type BlueprintSelectionFrameProps = {
  projectNumber: string;
};

export function BlueprintSelectionFrame({ projectNumber }: BlueprintSelectionFrameProps) {
  return (
    <span className="blueprint-selection-frame" aria-hidden="true">
      <span className="blueprint-selection-label">PROJECT / {projectNumber.padStart(3, "0")}</span>
      <i className="blueprint-handle blueprint-handle-nw" />
      <i className="blueprint-handle blueprint-handle-ne" />
      <i className="blueprint-handle blueprint-handle-sw" />
      <i className="blueprint-handle blueprint-handle-se" />
    </span>
  );
}
