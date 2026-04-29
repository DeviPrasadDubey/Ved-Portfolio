type Props = {
  children: React.ReactNode;
  as?: "div" | "section" | "article";
  className?: string;
};

/**
 * Shared max-width + horizontal rhythm for all story nodes (avoids one-off
 * `mx-auto max-w-7xl px-6` drift across the portfolio).
 */
export function ResponsiveWrapper({
  children,
  as: Tag = "div",
  className,
}: Props) {
  return (
    <Tag
      className={[
        "mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
