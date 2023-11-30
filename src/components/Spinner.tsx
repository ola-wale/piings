const Spinner = ({ percent, className, ...rest }: { percent: number, className?: string }) => {
  const circumference = 2 * 30 * Math.PI;
  return <svg className={`w-4 h-4 overflow-visible ${className}`}>
    <circle
      className="text-gray-300"
      strokeWidth="2"
      stroke="currentColor"
      fill="transparent"
      r="5"
      cx="9"
      cy="9"
    />
    <circle
      className="text-blue-600"
      strokeWidth="2"
      strokeDasharray={circumference}
      strokeDashoffset={circumference - percent / 100 * circumference}
      strokeLinecap="round"
      stroke="currentColor"
      fill="transparent"
      r="5"
      cx="9"
      cy="9"
    />
  </svg>
}

export default Spinner;
