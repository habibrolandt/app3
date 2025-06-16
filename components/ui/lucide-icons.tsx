import type { LightbulbIcon as LucideProps } from "lucide-react"

export const HandWater = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16.5 5.5C18 7 18 9.5 16.5 11C15 12.5 12.5 12.5 11 11C9.5 9.5 9.5 7 11 5.5C12.5 4 15 4 16.5 5.5Z" />
    <path d="M3 21L5 14.5L9.5 19L13 15.5L16 18L21 13" />
    <path d="M9.5 19L5 14.5" />
    <path d="M13 15.5L16 18" />
  </svg>
)
