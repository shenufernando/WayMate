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

    // Set the user provided direct image link specifically for the banner
    const imageUrl = "https://www.ceylontraveldream.com/images/sri-lanka-tours/sri-lanka-tours.jpg";

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