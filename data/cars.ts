export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceXLM: number;
  seats: number;
  transmission: "Otomatik" | "Manuel";
  fuelType: string;
  image: string;
  features: string[];
  available: boolean;
}

export const cars: Car[] = [
  {
    id: "1",
    name: "Model 3",
    brand: "Tesla",
    category: "Elektrikli",
    priceXLM: 1.5,
    seats: 5,
    transmission: "Otomatik",
    fuelType: "Elektrik",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop",
    features: ["Autopilot", "Şarj Dahil", "Wi-Fi", "Panoramik Çatı"],
    available: true,
  },
  {
    id: "2",
    name: "GLE 400",
    brand: "Mercedes",
    category: "SUV",
    priceXLM: 2,
    seats: 7,
    transmission: "Otomatik",
    fuelType: "Benzin",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop",
    features: ["Deri Döşeme", "Isıtmalı Koltuk", "360° Kamera", "Buzdolabı"],
    available: true,
  },
  {
    id: "3",
    name: "718 Cayman",
    brand: "Porsche",
    category: "Spor",
    priceXLM: 3.5,
    seats: 2,
    transmission: "Otomatik",
    fuelType: "Benzin",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&auto=format&fit=crop",
    features: ["Sport Chrono", "Bose Ses", "Karbon Fren", "Sport Egzoz"],
    available: true,
  },
  {
    id: "4",
    name: "X5 M",
    brand: "BMW",
    category: "SUV",
    priceXLM: 2.8,
    seats: 5,
    transmission: "Otomatik",
    fuelType: "Benzin",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop",
    features: ["M Sport", "Harman Kardon", "Panoramik", "Head-Up Display"],
    available: true,
  },
  {
    id: "5",
    name: "Giulia",
    brand: "Alfa Romeo",
    category: "Sedan",
    priceXLM: 1.8,
    seats: 5,
    transmission: "Otomatik",
    fuelType: "Dizel",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop",
    features: ["DNA Pro Sistem", "Karbon Fiber", "Harman Kardon", "Deri"],
    available: true,
  },
  {
    id: "6",
    name: "Range Rover Sport",
    brand: "Land Rover",
    category: "SUV",
    priceXLM: 3.2,
    seats: 5,
    transmission: "Otomatik",
    fuelType: "Benzin",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format&fit=crop",
    features: ["Terrain Response", "Meridian Ses", "Soğutmalı Koltuk", "AirSuspension"],
    available: false,
  },
];

export const RENTAL_WALLET = "GCTEFNX73U7WYA6CN5JXGMVHC4JIWTOGYOKSAIBXLX6FYW5U3OCTKDBR";
