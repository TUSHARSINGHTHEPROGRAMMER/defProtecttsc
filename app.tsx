'use client'

import React, { useState, useEffect } from 'react'
import { MapIcon, LeafIcon, ShoppingCartIcon, AlertTriangleIcon, BellIcon, UserIcon, MessageSquareIcon, HomeIcon, WindIcon, SearchIcon, MenuIcon, ChevronDownIcon, LockIcon, MapPinIcon } from 'lucide-react'
import dynamic from 'next/dynamic'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dynamically import the MapContainer component to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

type Alert = {
  id: number
  type: string
  location: string
  severity: string
}

type Product = {
  id: number
  name: string
  price: number
  seller: string
}

type NewsItem = {
  id: number
  title: string
  content: string
  date: string
}

type Message = {
  id: number
  user: string
  content: string
  timestamp: string
}

type User = {
  id: number
  name: string
  email: string
  role: 'user' | 'seller'
  avatar: string
  score: number
  treesPlanted: number
}

export default function AndroidApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasLocation, setHasLocation] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, type: 'Deforestation', location: 'Amazon Rainforest', severity: 'High' },
    { id: 2, type: 'Air Quality', location: 'Beijing', severity: 'Medium' },
  ])
  const [newAlert, setNewAlert] = useState<Omit<Alert, 'id'>>({ type: '', location: '', severity: '' })
  const [mapCenter, setMapCenter] = useState<[number, number]>([-3.4653, -62.2159]) // Amazon Rainforest
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Oak Saplings', price: 12.99, seller: 'GreenThumb Nursery' },
    { id: 2, name: 'Maple Seeds', price: 8.50, seller: 'Forest Friends Co.' },
  ])
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', price: 0, seller: '' })
  const [reforestationSuggestion, setReforestationSuggestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: 'EcoWarrior', content: 'We need to act fast to save our forests!', timestamp: '2023-06-10 14:30' },
    { id: 2, user: 'GreenThumb', content: 'I agree! Let\'s organize a tree planting event.', timestamp: '2023-06-10 14:35' },
  ])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [news, setNews] = useState<NewsItem[]>([
    { id: 1, title: 'Alarming Deforestation Rates in Amazon', content: 'Recent satellite images show...', date: '2023-06-09' },
    { id: 2, title: 'New Reforestation Initiative in Africa', content: 'A group of NGOs have joined forces...', date: '2023-06-08' },
  ])
  const [aqi, setAqi] = useState(150)
  const [user, setUser] = useState<User>({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: '/placeholder.svg?height=40&width=40',
    score: 750,
    treesPlanted: 50,
  })

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials here
    setIsLoggedIn(true)
  }

  const handleLocationSubmit = (latitude: number, longitude: number) => {
    setMapCenter([latitude, longitude])
    setHasLocation(true)
  }

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
  }

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault()
    setAlerts(prevAlerts => [...prevAlerts, { id: prevAlerts.length + 1, ...newAlert }])
    setNewAlert({ type: '', location: '', severity: '' })
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    setProducts(prevProducts => [...prevProducts, { id: prevProducts.length + 1, ...newProduct }])
    setNewProduct({ name: '', price: 0, seller: '' })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const newMsg: Message = {
      id: messages.length + 1,
      user: user.name,
      content: newMessage,
      timestamp: new Date().toLocaleString(),
    }
    setMessages(prevMessages => [...prevMessages, newMsg])
    setNewMessage('')
  }

  const generateReforestationSuggestion = () => {
    const sizes = ['small', 'medium', 'large']
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const cost = Math.floor(Math.random() * 10000) + 5000
    setReforestationSuggestion(`We suggest a ${size}-scale reforestation project. Estimated cost: $${cost}. This could significantly improve local biodiversity and air quality.`)
  }

  const calculateAqiImprovement = () => {
    const improvement = Math.floor(Math.random() * 50) + 10
    setAqi(prevAqi => Math.max(0, prevAqi - improvement))
  }

  useEffect(() => {
    generateReforestationSuggestion()
    calculateAqiImprovement()
  }, [])

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'from-green-600 to-green-800'
    if (aqi <= 100) return 'from-yellow-600 to-yellow-800'
    if (aqi <= 150) return 'from-orange-600 to-orange-800'
    if (aqi <= 200) return 'from-red-600 to-red-800'
    if (aqi <= 300) return 'from-purple-600 to-purple-800'
    return 'from-maroon-600 to-maroon-800'
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-800 to-green-950">
        <div className="w-full max-w-md p-8 space-y-8 bg-green-900 bg-opacity-50 rounded-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-green-300">Welcome to EcoGuard</h2>
            <p className="mt-2 text-sm text-green-200">Sign in to your account</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin('user@example.com', 'password'); }}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  required
                  className="bg-green-800 bg-opacity-50 text-green-300 placeholder-green-500 border-green-600"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  className="bg-green-800 bg-opacity-50 text-green-300 placeholder-green-500 border-green-600 mt-2"
                />
              </div>
            </div>
            <div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                <LockIcon className="w-5 h-5 mr-2" />
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (!hasLocation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-800 to-green-950">
        <div className="w-full max-w-md p-8 space-y-8 bg-green-900 bg-opacity-50 rounded-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-green-300">Set Your Location</h2>
            <p className="mt-2 text-sm text-green-200">We need your location to provide accurate information</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLocationSubmit(0, 0); }}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Input
                  type="number"
                  placeholder="Latitude"
                  required
                  className="bg-green-800 bg-opacity-50 text-green-300 placeholder-green-500 border-green-600"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Longitude"
                  required
                  className="bg-green-800 bg-opacity-50 text-green-300 placeholder-green-500 border-green-600 mt-2"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Set Location
              </Button>
              <Button onClick={() => handleLocationSubmit(0, 0)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <MapIcon className="w-5 h-5 mr-2" />
                Use GPS
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-800 to-green-950 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-300">Welcome to EcoGuard</h2>
              <p className="mb-4 text-green-200">Stay informed about deforestation and contribute to reforestation efforts.</p>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-green-900 bg-opacity-50 text-green-300 placeholder-green-500 border-green-600"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-300">Latest News</h3>
              {news.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <div key={item.id} className="mb-4 p-4 bg-green-900 bg-opacity-50 rounded-lg">
                  <h4 className="font-semibold text-green-300">{item.title}</h4>
                  <p className="text-sm text-green-200">{item.date}</p>
                  <p className="text-green-100">{item.content}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-800 to-red-950 rounded-lg shadow-md p-4">
                <h4 className="text-lg font-semibold mb-2 text-red-300">Active Alerts</h4>
                <p className="text-3xl font-bold text-red-200">{alerts.length}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-700 to-yellow-900 rounded-lg shadow-md p-4">
                <h4 className="text-lg font-semibold mb-2 text-yellow-300">Current AQI</h4>
                <p className="text-3xl font-bold text-yellow-200">{aqi}</p>
              </div>
              <div className="bg-gradient-to-br from-green-800 to-green-950 rounded-lg shadow-md p-4">
                <h4 className="text-lg font-semibold mb-2 text-green-300">Trees Planted</h4>
                <p className="text-3xl font-bold text-green-200">{user.treesPlanted}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-800 to-blue-950 rounded-lg shadow-md p-4">
                <h4 className="text-lg font-semibold mb-2 text-blue-300">EcoScore</h4>
                <p className="text-3xl font-bold text-blue-200">{user.score}</p>
              </div>
            </div>
          </div>
        )
      case 'Map':
        return (
          <div className="bg-gradient-to-r from-blue-800 to-blue-950 rounded-lg shadow-md p-4 mb-6 h-[500px]">
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Deforestation Map</h3>
            <MapContainer center={mapCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {alerts.map((alert) => (
                <Marker key={alert.id} position={mapCenter}>
                  <Popup>{`${alert.type} alert in ${alert.location}`}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )
      case 'Alerts':
        return (
          <div className="bg-gradient-to-r from-red-800 to-red-950 rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-red-300">Active Alerts</h3>
            <ul className="space-y-2 mb-4">
              {alerts.map((alert) => (
                <li key={alert.id} className="flex items-center space-x-2">
                  <AlertTriangleIcon className={`w-5 h-5 ${alert.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />
                  <span className="text-red-200">{`${alert.type} alert in ${alert.location} (${alert.severity} severity)`}</span>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddAlert} className="space-y-2">
              <Input
                placeholder="Alert Type"
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                required
                className="bg-red-900 bg-opacity-50 text-red-300 placeholder-red-500 border-red-600"
              />
              <Input
                placeholder="Location"
                value={newAlert.location}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                required
                className="bg-red-900 bg-opacity-50 text-red-300 placeholder-red-500 border-red-600"
              />
              <select
                className="w-full p-2 border rounded bg-red-900 bg-opacity-50 text-red-300 border-red-600"
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                required
              >
                <option value="">Select Severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Add Alert</Button>
            </form>
          </div>
        )
      case 'Reforestation':
        return (
          <div className="bg-gradient-to-r from-green-800 to-green-950 rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-green-300">AI Reforestation Suggestion</h3>
            <p className="mb-4 text-green-200">{reforestationSuggestion}</p>
            <Button onClick={generateReforestationSuggestion} className="bg-green-600 hover:bg-green-700 text-white">Generate New Suggestion</Button>
            <h3 className="text-lg font-semibold mt-6 mb-2 text-green-300">Active Projects</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <LeafIcon className="w-5 h-5 text-green-500" />
                <span className="text-green-200">California Redwood Restoration - 10,000 trees planted</span>
              </li>
              <li className="flex items-center space-x-2">
                <LeafIcon className="w-5 h-5 text-green-500" />
                <span className="text-green-200">Amazon Rainforest Recovery Initiative - 50,000 trees planted</span>
              </li>
            </ul>
          </div>
        )
      case 'Marketplace':
        return (
          <div className="bg-gradient-to-r from-purple-800 to-purple-950 rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-purple-300">Plant Marketplace</h3>
            <ul className="space-y-2 mb-4">
              {products.map((product) => (
                <li key={product.id} className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <ShoppingCartIcon className="w-5 h-5 text-purple-500" />
                    <span className="text-purple-200">{product.name}</span>
                  </span>
                  <span className="text-purple-300">${product.price.toFixed(2)} - {product.seller}</span>
                </li>
              ))}
            </ul>
            {user.role === 'seller' && (
              <form onSubmit={handleAddProduct} className="space-y-2">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  className="bg-purple-900 bg-opacity-50 text-purple-300 placeholder-purple-500 border-purple-600"
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                  }
                  required
                  className="bg-purple-900 bg-opacity-50 text-purple-300 placeholder-purple-500 border-purple-600"
                />
                <Input
                  placeholder="Seller Name"
                  value={newProduct.seller}
                  onChange={(e) => setNewProduct({ ...newProduct, seller: e.target.value })}
                  required
                  className="bg-purple-900 bg-opacity-50 text-purple-300 placeholder-purple-500 border-purple-600"
                />
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Add Product</Button>
              </form>
            )}
            {user.role === 'user' && (
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Buy Products</Button>
            )}
          </div>
        )
      case 'Social':
        return (
          <div className="bg-gradient-to-r from-teal-800 to-teal-950 rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-teal-300">Community Discussion</h3>
            <div className="h-64 overflow-y-auto mb-4 space-y-2">
              {messages.map((message) => (
                <div key={message.id} className="bg-teal-900 bg-opacity-50 p-2 rounded">
                  <span className="font-semibold text-teal-300">{message.user}: </span>
                  <span className="text-teal-200">{message.content}</span>
                  <span className="text-xs text-teal-400 ml-2">{message.timestamp}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
                className="bg-teal-900 bg-opacity-50 text-teal-300 placeholder-teal-500 border-teal-600"
              />
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">Send Message</Button>
            </form>
          </div>
        )
      case 'AQI':
        return (
          <div className={`bg-gradient-to-r ${getAqiColor(aqi)} rounded-lg shadow-md p-4 mb-6`}>
            <h3 className="text-lg font-semibold mb-2 text-white">Air Quality Index (AQI)</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl font-bold text-white">{aqi}</div>
              <div>
                <p className="text-sm text-gray-200">Current AQI</p>
                <p className={`text-sm ${aqi > 100 ? 'text-red-300' : 'text-green-300'}`}>
                  {aqi > 100 ? 'Unhealthy' : 'Moderate'}
                </p>
              </div>
            </div>
            <Progress value={aqi} max={500} className="mb-4" />
            <p className="mb-4 text-white">
              The current AQI is {aqi > 100 ? 'high' : 'moderate'}. Reforestation efforts could significantly improve air quality.
            </p>
            <div className="bg-black bg-opacity-20 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2 text-white">AQI Breakdown:</h4>
              <ul className="list-disc list-inside text-gray-200">
                <li>PM2.5: {Math.round(aqi * 0.4)} µg/m³</li>
                <li>PM10: {Math.round(aqi * 0.6)} µg/m³</li>
                <li>Ozone: {Math.round(aqi * 0.3)} ppb</li>
                <li>NO2: {Math.round(aqi * 0.2)} ppb</li>
              </ul>
            </div>
            <Button onClick={calculateAqiImprovement} className="bg-white text-gray-800 hover:bg-gray-200">Simulate Reforestation Impact</Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-green-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-green-950 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-300">EcoGuard</h1>
        <div className="flex items-center space-x-4">
          <BellIcon className="w-6 h-6 text-green-300" />
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0">
                <MenuIcon className="w-6 h-6 text-green-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-green-900 border border-green-600">
              {['Home', 'Map', 'Alerts', 'Reforestation', 'Marketplace', 'Social', 'AQI'].map((tab) => (
                <DropdownMenuItem key={tab} onSelect={() => handleTabClick(tab)} className="text-green-300 hover:bg-green-800">
                  {tab}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-gradient-to-r from-green-800 to-green-950 p-2">
        <ul className="flex justify-around">
          {['Home', 'Map', 'Alerts', 'Reforestation', 'Marketplace', 'Social', 'AQI'].map((tab) => (
            <li key={tab}>
              <button
                onClick={() => handleTabClick(tab)}
                className={`flex flex-col items-center ${
                  activeTab === tab ? 'text-green-300' : 'text-green-600 hover:text-green-400'
                }`}
              >
                {tab === 'Home' && <HomeIcon className="w-6 h-6" />}
                {tab === 'Map' && <MapIcon className="w-6 h-6" />}
                {tab === 'Alerts' && <AlertTriangleIcon className="w-6 h-6" />}
                {tab === 'Reforestation' && <LeafIcon className="w-6 h-6" />}
                {tab === 'Marketplace' && <ShoppingCartIcon className="w-6 h-6" />}
                {tab === 'Social' && <MessageSquareIcon className="w-6 h-6" />}
                {tab === 'AQI' && <WindIcon className="w-6 h-6" />}
                <span className="text-xs mt-1">{tab}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}