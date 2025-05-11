"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { Shirt, Upload } from "lucide-react"

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
  // Reference to the file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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

  // Handle theme switching with Alt+Q
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "q") {
        setCurrentTheme((prev) => {
          if (prev === "light") return "dark"
          if (prev === "dark") return "colorful"
          return "light"
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Handle form submission
  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data, "Uploaded image:", uploadedImage)
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
          card: "bg-gray-800",
          input: "bg-gray-700 text-white border-gray-600",
          button: "bg-blue-600 hover:bg-blue-700",
          dropzone: "border-gray-600 bg-gray-700",
        }
      case "colorful":
        return {
          background: "bg-gradient-to-r from-purple-500 to-pink-500",
          text: "text-white",
          card: "bg-white/10 backdrop-blur-md",
          input: "bg-white/20 text-white border-white/30",
          button: "bg-amber-500 hover:bg-amber-600",
          dropzone: "border-white/30 bg-white/20",
        }
      default: // light
        return {
          background: "bg-gray-100",
          text: "text-gray-900",
          card: "bg-white",
          input: "bg-white text-gray-900 border-gray-300",
          button: "bg-blue-500 hover:bg-blue-600",
          dropzone: "border-gray-300 bg-gray-50",
        }
    }
  }

  const theme = getThemeClasses()

  return (
    <div className={`min-h-screen ${theme.background} ${theme.text} p-4 md:p-8`}>
      <div className={`max-w-4xl mx-auto ${theme.card} rounded-lg shadow-lg p-6`}>
        <div className="flex items-center justify-center mb-6">
          <Shirt className="w-8 h-8 mr-2" />
          <h1 className="text-2xl font-bold">T-Shirt Customizer</h1>
        </div>

        <p className="text-sm mb-4">
          Press <kbd className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs">Alt + Q</kbd> to switch themes
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Controls Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium mb-1">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                className={`w-full px-3 py-2 rounded-md border ${theme.input}`}
                {...register("height", { required: true, min: 100, max: 250 })}
              />
              {errors.height && <p className="text-red-500 text-xs mt-1">Height must be between 100-250 cm</p>}
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-1">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                className={`w-full px-3 py-2 rounded-md border ${theme.input}`}
                {...register("weight", { required: true, min: 30, max: 200 })}
              />
              {errors.weight && <p className="text-red-500 text-xs mt-1">Weight must be between 30-200 kg</p>}
            </div>

            <div>
              <label htmlFor="build" className="block text-sm font-medium mb-1">
                Build
              </label>
              <select
                id="build"
                className={`w-full px-3 py-2 rounded-md border ${theme.input}`}
                {...register("build", { required: true })}
              >
                <option value="lean">Lean</option>
                <option value="regular">Regular</option>
                <option value="athletic">Athletic</option>
                <option value="big">Big</option>
              </select>
            </div>
          </div>

          {/* T-Shirt Design Preview */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-lg font-medium mb-2">T-Shirt Design</h2>
              <div
                className={`relative aspect-square max-w-xs mx-auto border ${theme.dropzone} rounded-md overflow-hidden`}
              >
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="T-shirt design"
                  width={300}
                  height={300}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-medium mb-2">Upload Your Design</h2>
              <div
                className={`relative aspect-square max-w-xs mx-auto border-2 border-dashed ${theme.dropzone} rounded-md flex flex-col items-center justify-center cursor-pointer`}
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded design"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Drag & drop an image or click to upload</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            </div>
          </div>

          {/* T-Shirt Text */}
          <div>
            <label htmlFor="tshirtText" className="block text-lg font-medium mb-2">
              T-Shirt Text (max 3 lines)
            </label>
            <textarea
              id="tshirtText"
              rows={3}
              className={`w-full px-3 py-2 rounded-md border ${theme.input} resize-none`}
              placeholder="Enter text to print on your T-shirt..."
              value={tshirtText}
              onChange={handleTextChange}
            />
            <p className="text-sm mt-1">{tshirtText?.split("\n").length || 0}/3 lines used</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`px-6 py-2 rounded-md text-white font-medium ${theme.button} transition-colors`}
            >
              Save Customization
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
