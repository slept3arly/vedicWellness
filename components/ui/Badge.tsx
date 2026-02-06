type Props = {
  children: React.ReactNode;
};

export default function Badge({ children }: Props) {
  return (
    <span className="
      inline-flex items-center gap-1
      px-4 py-1.5 text-xs font-medium
      rounded-full
      bg-green-500/10 text-green-800
      dark:text-green-300
      border border-green-500/20
      backdrop-blur
    ">
      {children}
    </span>
  );
}
