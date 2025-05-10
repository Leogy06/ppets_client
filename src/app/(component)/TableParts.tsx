interface Theadprops {
  theadText: string;
}

export const Thead = ({ theadText }: Theadprops) => {
  return <th className="px-4 py-2  text-start">{theadText}</th>;
};
