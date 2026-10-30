// backend/controllers/aiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI with API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateTripPlan = async (req, res) => {
  try {
    const { destination, duration, budget, interests, travelerType } = req.body;

    if (!destination || !duration) {
      return res.status(400).json({ message: "Destination and duration are required." });
    }

    const userInterests = Array.isArray(interests) && interests.length > 0 
      ? interests.join(", ") 
      : "General Exploration";

    // Comprehensive Sri Lanka Destination Image Mapping (Real Unsplash HD Links)
    const destLower = destination.toLowerCase();
    let imageUrl = "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1920&auto=format&fit=crop";

    if (destLower.includes("kandy")) {
      imageUrl = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("ella")) {
      imageUrl = "https://images.unsplash.com/photo-1578592598172-17804a524a91?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("galle")) {
      imageUrl = "https://images.unsplash.com/photo-1588598124484-e91b10a6ded3?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("nuwara eliya") || destLower.includes("nuwara")) {
      imageUrl = "https://images.unsplash.com/photo-1596401057633-54a8ad8d5d08?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("sigiriya") || destLower.includes("dambulla")) {
      imageUrl = "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("colombo")) {
      imageUrl = "https://images.unsplash.com/photo-1589182337358-2fabedd73f9d?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("mirissa") || destLower.includes("bentota") || destLower.includes("hikkaduwa")) {
      imageUrl = "https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("yala") || destLower.includes("udawalawe") || destLower.includes("wilpattu")) {
      imageUrl = "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("trincomalee") || destLower.includes("pasikudah") || destLower.includes("arugam")) {
      imageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("jaffna")) {
      imageUrl = "https://images.unsplash.com/photo-1588599320442-a950561cc7d4?q=80&w=1920&auto=format&fit=crop";
    } else if (destLower.includes("anuradhapura") || destLower.includes("polonnaruwa")) {
      imageUrl = "https://images.unsplash.com/photo-1609828913662-8588ab23b8f1?q=80&w=1920&auto=format&fit=crop";
    }

    const prompt = `
    You are an expert Sri Lanka travel guide for WayMate application.
    Generate a highly localized, realistic, and time-slotted travel itinerary for:
    - Destination: ${destination}, Sri Lanka
    - Duration: ${duration}
    - Budget Level: ${budget || "Mid-range"}
    - Traveler Type: ${travelerType || "Couple"}
    - Interests/Vibes: ${userInterests}

    Strict Rules:
    1. Only include real, existing places, attractions, activities, and dining spots specific to ${destination}, Sri Lanka.
    2. Provide time slots for each activity (e.g., "08:30 AM - 10:30 AM").
    3. Return ONLY a valid JSON object matching this exact structure without markdown formatting, backticks, or text before/after:

    {
      "summary": "Short 1-2 sentence overview of the trip",
      "itinerary": [
        {
          "day": 1,
          "title": "Day Title",
          "activities": [
            { "time": "08:30 AM - 10:30 AM", "description": "Specific real activity description" }
          ]
        }
      ]
    }
    `;

    // Huutoro model moɗiiɗo mo alaa caɗeele (Stable Model)
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedJsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const aiData = JSON.parse(cleanedJsonString);

    const tripPlan = {
      destination: destination,
      duration: duration,
      budget: budget || "Mid-range (LKR 30k - 100k)",
      travelerType: travelerType || "Couple",
      imageUrl: imageUrl,
      summary: aiData.summary,
      itinerary: aiData.itinerary
    };

    res.status(200).json({
      success: true,
      data: tripPlan
    });

  } catch (error) {
    console.error("Gemini AI Generation Error:", error);
    res.status(500).json({ message: "Failed to generate AI trip plan", error: error.message });
  }
};