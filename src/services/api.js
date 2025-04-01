const API_URL = "www.themealdb.com/api/json/v1/1";

export const getLatestDishes = async () =>{
    const response = await fetch(`${API_URL}/latest.php`);
    const data = await response.json();
    return data.results;
}