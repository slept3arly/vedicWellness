type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <input
      {...props}
      className="
        w-full px-4 py-3 rounded-[14px]
        bg-[var(--bg-surface)]
        border border-[var(--border-soft)]
        text-[var(--text-main)]
        placeholder:text-[var(--text-muted)]
        outline-none transition
        focus:border-green-500/40
        focus:ring-2 focus:ring-green-500/20
        shadow-sm
      "
    />
  );
}
