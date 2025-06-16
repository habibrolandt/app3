import { Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudDrizzle, Sun, Wind } from "lucide-react"

interface WeatherIconProps {
  condition: string
  className?: string
  size?: number
}

export function WeatherIcon({ condition, className, size = 24 }: WeatherIconProps) {
  const getIconByCondition = () => {
    const lowercaseCondition = condition.toLowerCase()

    if (lowercaseCondition.includes("rain") || lowercaseCondition.includes("shower")) {
      return <CloudRain size={size} className={className} />
    } else if (lowercaseCondition.includes("snow")) {
      return <CloudSnow size={size} className={className} />
    } else if (lowercaseCondition.includes("fog") || lowercaseCondition.includes("mist")) {
      return <CloudFog size={size} className={className} />
    } else if (lowercaseCondition.includes("thunder") || lowercaseCondition.includes("lightning")) {
      return <CloudLightning size={size} className={className} />
    } else if (lowercaseCondition.includes("drizzle")) {
      return <CloudDrizzle size={size} className={className} />
    } else if (lowercaseCondition.includes("sun") || lowercaseCondition.includes("clear")) {
      return <Sun size={size} className={className} />
    } else if (lowercaseCondition.includes("cloud")) {
      return <Cloud size={size} className={className} />
    } else if (lowercaseCondition.includes("wind")) {
      return <Wind size={size} className={className} />
    } else {
      // Default icon when condition doesn't match any specific weather
      return <Cloud size={size} className={className} />
    }
  }

  return getIconByCondition()
}
