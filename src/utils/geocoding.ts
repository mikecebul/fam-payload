import axios from "axios";

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; // Ensure this is set in your environment

export async function geocodeAddress(address: string) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: address,
          key: googleMapsApiKey,
        },
      }
    );

    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}
