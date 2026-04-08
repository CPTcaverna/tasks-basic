function Button(props: {
  children: React.ReactNode;
  onClick?: () => void;
  hoverColor: string;
}) {
  return (
    <button
      onClick={props.onClick}
      className={`bg-slate-400 ${props.hoverColor} p-2 rounded-md text-white`}
    >
      {props.children}
    </button>
  );
}

export default Button;
