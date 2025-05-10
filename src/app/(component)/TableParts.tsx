interface Theadprops {
  theadText: string;
}

export const Thead = ({ theadText }: Theadprops) => {
  return <th className="px-4 py-2  text-start">{theadText}</th>;
};

export const Tdata = ({
  tDataText,
  minWidth,
}: {
  tDataText: string;
  minWidth?: "large" | "small" | "medium" | "very_large";
}) => {
  let width;

  switch (minWidth) {
    case "small":
      width = 100;
      break;
    case "medium":
      width = 200;
      break;
    case "large":
      width = 300;
      break;
    case "very_large":
      width = 1000;
      break;
    default:
      width = 150;
      break;
  }

  return (
    <td className={`px-4 py-2 text-start min-w-[${width}px]`}>{tDataText}</td>
  );
};
