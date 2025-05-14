"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { Shirt, Upload, Sparkles, Palette, ArrowRight, Check } from "lucide-react"

// Define the form data structure
type FormData = {
  height: number
  weight: number
  build: string
  tshirtText: string
}

// Define the available themes
type Theme = "light" | "dark" | "colorful"

export default function TShirtCustomizer() {
  // State for the uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  // State for the current theme
  const [currentTheme, setCurrentTheme] = useState<Theme>("light")
  // State for animation
  const [isAnimating, setIsAnimating] = useState(false)
  // Reference to the file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      height: 180,
      weight: 80,
      build: "athletic",
      tshirtText: "",
    },
  })

  // Watch the tshirt text to limit it to 3 lines
  const tshirtText = watch("tshirtText")
  const height = watch("height")
  const weight = watch("weight")
  const build = watch("build")

  // Handle theme switching with Alt+Q
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "q") {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentTheme((prev) => {
            if (prev === "light") return "dark"
            if (prev === "dark") return "colorful"
            return "light"
          })
        }, 150)
        setTimeout(() => setIsAnimating(false), 300)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data, "Uploaded image:", uploadedImage)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Here you would typically send this data to a server
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Limit text to 3 lines
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    const lines = text.split("\n")
    if (lines.length <= 3) {
      setValue("tshirtText", text)
    } else {
      setValue("tshirtText", lines.slice(0, 3).join("\n"))
    }
  }

  // Get theme-specific classes
  const getThemeClasses = () => {
    switch (currentTheme) {
      case "dark":
        return {
          background: "bg-gray-900",
          text: "text-white",
          card: "bg-gray-800 shadow-xl shadow-gray-900/30",
          input: "bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500",
          button: "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-700/30",
          dropzone: "border-gray-600 bg-gray-700 hover:border-purple-500 hover:bg-gray-600",
          accent: "text-purple-400",
          slider: "accent-purple-500",
          highlight: "bg-purple-500/10 border-purple-500/20",
          tshirt: "bg-gray-700",
        }
      case "colorful":
        return {
          background: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500",
          text: "text-white",
          card: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-pink-900/20",
          input: "bg-white/20 text-white border-white/30 focus:border-yellow-300 focus:ring-yellow-300",
          button:
            "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg shadow-orange-600/30",
          dropzone: "border-white/30 bg-white/20 hover:border-yellow-300 hover:bg-white/30",
          accent: "text-yellow-300",
          slider: "accent-yellow-400",
          highlight: "bg-yellow-500/10 border-yellow-500/20",
          tshirt: "bg-orange-100",
        }
      default: // light
        return {
          background: "bg-gradient-to-br from-sky-50 to-indigo-100",
          text: "text-gray-800",
          card: "bg-white shadow-xl shadow-indigo-200/50",
          input: "bg-white text-gray-900 border-gray-300 focus:border-teal-500 focus:ring-teal-500",
          button:
            "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-500/30",
          dropzone: "border-gray-300 bg-gray-50 hover:border-teal-500 hover:bg-gray-100",
          accent: "text-teal-600",
          slider: "accent-teal-500",
          highlight: "bg-teal-50 border-teal-100",
          tshirt: "bg-white",
        }
    }
  }

  const theme = getThemeClasses()

  return (
    <div
      className={`min-h-screen ${theme.background} ${theme.text} p-4 md:p-8 transition-colors duration-300 ease-in-out`}
    >
      <div
        className={`max-w-5xl mx-auto ${theme.card} rounded-2xl p-6 md:p-8 transition-all duration-300 ease-in-out ${isAnimating ? "scale-95 opacity-80" : "scale-100 opacity-100"}`}
      >
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <Shirt className={`w-10 h-10 mr-3 ${theme.accent}`} />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">T-Shirt Customizer</h1>
        </div>

        <div className={`mb-6 p-3 rounded-lg border ${theme.highlight} flex items-center justify-between`}>
          <p className="text-sm flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Press <kbd className="mx-2 px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs font-mono">Alt + Q</kbd> to
            switch themes
          </p>
          <p className="text-sm font-medium">
            Current theme: <span className={`${theme.accent} capitalize`}>{currentTheme}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Controls Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="height" className="block text-sm font-medium mb-1 flex items-center">
                Height (cm)
              </label>
              <input
                id="height"
                type="range"
                min="100"
                max="250"
                step="1"
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme.slider}`}
                {...register("height", { required: true, min: 100, max: 250 })}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-70">100 cm</span>
                <span className="text-lg font-semibold">{height} cm</span>
                <span className="text-xs opacity-70">250 cm</span>
              </div>
              {errors.height && <p className="text-red-500 text-xs mt-1">Height must be between 100-250 cm</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="block text-sm font-medium mb-1 flex items-center">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="range"
                min="30"
                max="200"
                step="1"
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme.slider}`}
                {...register("weight", { required: true, min: 30, max: 200 })}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-70">30 kg</span>
                <span className="text-lg font-semibold">{weight} kg</span>
                <span className="text-xs opacity-70">200 kg</span>
              </div>
              {errors.weight && <p className="text-red-500 text-xs mt-1">Weight must be between 30-200 kg</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="build" className="block text-sm font-medium mb-1">
                Build
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["lean", "regular", "athletic", "big"].map((option) => (
                  <label
                    key={option}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                      ${
                        build === option
                          ? `${theme.accent} border-current font-medium`
                          : "border-gray-300 opacity-70 hover:opacity-100"
                      }
                    `}
                  >
                    <input type="radio" value={option} className="sr-only" {...register("build")} />
                    <span className="capitalize">{option}</span>
                    {build === option && <Check className="w-4 h-4 ml-2" />}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* T-Shirt Design Preview */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-3 flex items-center">
                <Shirt className="w-5 h-5 mr-2" />
                T-Shirt Preview
              </h2>
              <div
                className={`relative aspect-[4/5] max-w-xs mx-auto border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 shadow-lg bg-transparent`}
              >
                {/* Base T-shirt image - this is the bottom layer */}
                <div className="absolute inset-0 z-10">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 300 360" className="w-full h-full">
                      <path
                        d="M75,40 L225,40 L210,140 C210,140 250,160 250,180 L230,200 L230,320 L70,320 L70,200 L50,180 C50,160 90,140 90,140 L75,40"
                        fill="white"
                        stroke="#888"
                        strokeWidth="2"
                      />
                      <path d="M75,40 L110,80 L190,80 L225,40" fill="none" stroke="#888" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Uploaded image overlay - middle layer */}
                {uploadedImage && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-8">
                    <div className="w-[60%] h-[60%] relative">
                      <Image
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded design"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                )}

                {/* Text overlay - top layer */}
                {tshirtText && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
                    <div className="bg-black/10 backdrop-blur-sm p-4 rounded-lg max-w-[80%] text-center">
                      {tshirtText.split("\n").map((line, i) => (
                        <div key={i} className="font-bold text-lg md:text-xl text-black">
                          {line || <>&nbsp;</>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-medium mb-3 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Your Design
              </h2>
              <div
                className={`
                  relative aspect-square max-w-xs mx-auto border-2 border-dashed ${theme.dropzone} 
                  rounded-xl flex flex-col items-center justify-center cursor-pointer
                  transition-all duration-300 hover:scale-[1.02]
                `}
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="relative w-full h-full p-4">
                    <Image
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded design"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedImage(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.highlight} flex items-center justify-center`}
                    >
                      <Upload className="w-8 h-8 opacity-70" />
                    </div>
                    <p className="text-lg font-medium mb-2">Upload your design</p>
                    <p className="text-sm opacity-70 mb-4">Drag & drop an image or click to browse</p>
                    <p className="text-xs opacity-50">Supports: JPG, PNG, SVG</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            </div>
          </div>

          {/* T-Shirt Text */}
          <div className="bg-opacity-50 rounded-xl p-6 border border-opacity-20 backdrop-blur-sm">
            <label htmlFor="tshirtText" className="block text-lg font-medium mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              T-Shirt Text <span className="text-sm font-normal opacity-70 ml-2">(max 3 lines)</span>
            </label>
            <textarea
              id="tshirtText"
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border ${theme.input} resize-none transition-all focus:outline-none focus:ring-2`}
              placeholder="Enter text to print on your T-shirt..."
              value={tshirtText}
              onChange={handleTextChange}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm">
                <span className={`${tshirtText?.split("\n").length === 3 ? "text-orange-500 font-medium" : ""}`}>
                  {tshirtText?.split("\n").length || 0}
                </span>
                <span className="opacity-70">/3 lines used</span>
              </p>
              <button
                type="button"
                className="text-sm opacity-70 hover:opacity-100"
                onClick={() => setValue("tshirtText", "")}
              >
                Clear text
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-8 py-3 rounded-full text-white font-medium ${theme.button} 
                transition-all duration-300 flex items-center
                ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}
              `}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Save Customization
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
