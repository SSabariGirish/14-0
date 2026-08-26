import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the JSON file safely using fs
const rawData = fs.readFileSync(path.join(__dirname, 'players.json'), 'utf-8');
const players = JSON.parse(rawData);

// 1. Curated Set of Authentic Wicketkeepers
const validWKs = new Set([
  "MS Dhoni", "Dinesh Karthik", "Rishabh Pant", "Sanju Samson", "Ishan Kishan", 
  "Quinton de Kock", "Jos Buttler", "KL Rahul", "N Pooran", "Jonny Bairstow", 
  "Heinrich Klaasen", "Wriddhiman Saha", "Parthiv Patel", "Matthew Wade", 
  "Rahmanullah Gurbaz", "Phil Salt", "PD Salt", "Jitesh Sharma", "Prabhsimran Singh", 
  "Liton Das", "KS Bharat", "Vishnu Vinod", "Anuj Rawat", "Narayan Jagadeesan", 
  "Sheldon Jackson", "Shreevats Goswami", "Alex Carey", "Tim Seifert", "Donavon Ferreira", 
  "Kumar Kushagra", "BR Sharath", "Ricky Bhui", "PBB Rajapaksa", "Dhruv Jurel", 
  "Urvil Patel", "AB de Villiers", "Robin Uthappa", "Naman Ojha", "Sam Billings", 
  "Brendon McCullum", "T Kohler-Cadmore", "Josh Inglis", "Ryan Rickelton"
]);

// 2. Comprehensive List of IPL Overseas Players
const overseasPlayers = new Set([
  "David Warner", "Tymal Mills", "Moises Henriques", "Shane Watson", "Travis Head", "Ben Cutting",
  "Chris Gayle", "Rashid Khan", "Jos Buttler", "Ben Stokes", "Imran Tahir", "Adam Zampa",
  "Kieron Pollard", "Tim Southee", "Mitchell McClenaghan", "Steve Smith", "Jason Roy", "Trent Boult",
  "Brendon McCullum", "Sunil Narine", "Chris Woakes", "Aaron Finch", "Chris Lynn", "Dwayne Smith",
  "Marcus Stoinis", "Dan Christian", "Hashim Amla", "Glenn Maxwell", "David Miller", "Chris Morris",
  "Pat Cummins", "Carlos Brathwaite", "Billy Stanlake", "Sam Billings", "Kagiso Rabada", "Mitchell Johnson",
  "Lendl Simmons", "Matt Henry", "Isuru Udana", "Jason Holder", "Nathan Coulter-Nile", "D'Arcy Short",
  "Ben Laughlin", "Tom Curran", "Colin Munro", "Mujeeb Ur Rahman", "Akila Dananjaya", "Oshane Thomas",
  "Hardus Viljoen", "Dushmantha Chameera", "Matthew Wade", "Romario Shepherd", "Fazalhaq Farooqi",
  "Harry Brook", "Glenn Phillips", "RJW Topley", "Cameron Green", "Michael Bracewell", "Matheesha Pathirana",
  "Sisanda Magala", "Dwaine Pretorius", "Tristan Stubbs", "Matthew Short", "WD Parnell", "Lungi Ngidi",
  "Akeal Hosein", "Dasun Shanaka", "Kyle Jamieson", "Josh Hazlewood", "Fabian Allen", "Blessing Muzarabani",
  "Ricky Ponting", "Jacques Kallis", "David Hussey", "Cameron White", "Mohammad Hafeez", "Ashley Noffke",
  "Matthew Hayden", "Simon Katich", "Glenn McGrath", "B Geeves", "Darren Lehmann", "Shane Warne",
  "Luke Ronchi", "Sanath Jayasuriya", "Dominic Thornely", "Shaun Pollock", "Evin Lewis", "Faf du Plessis",
  "Kane Williamson", "Colin de Grandhomme", "Quinton de Kock", "Andre Russell", "Lockie Ferguson",
  "Rilee Rossouw", "Jake Fraser-McGurk", "Shai Hope", "Shamar Joseph", "WG Jacks", "Liam Livingstone",
  "Jhye Richardson", "Riley Meredith", "Daniel Vettori", "Marlon Samuels", "Corey Anderson",
  "Jason Behrendorff", "Dawid Malan", "Kyle Mayers", "Noor Ahmad", "Dilshan Madushanka", "KMA Paul",
  "Junior Dala", "Javon Searles", "Colin Ingram", "Nandre Burger", "Gerald Coetzee", "Spencer Johnson",
  "Luke Wood", "Allah Ghazanfar", "David Wiese", "Jamie Overton", "George Linde", "David Payne", 
  "Chris Green", "LB Williams", "SC Kuggeleijn", "Duan Jansen", "XC Bartlett", "M Jansen", "Andrew Tye", 
  "M Theekshana", "PWA Mulder", "Eoin Morgan", "Alex Hales", "Ish Sodhi", "JDP Oram", "Muttiah Muralitharan", 
  "Alzarri Joseph", "Josh Little", "N Thushara", "Cooper Connolly", "Matthew Breetzke", "Corbin Bosch", 
  "Jacob Bethell", "Karim Janat", "Eshan Malinga", "William O'Rourke", "Gulbadin Naib", "Sediqullah Atal", "PVSN Raju"
]);

const cleanedData = players.map(p => {
  let fixedRole = p.role;
  
  // Rule 1: Correct Mismatched Wicketkeepers
  if (p.role === "Wicketkeeper" && !validWKs.has(p.name)) {
    fixedRole = "Batter";
  }

  // Rule 2: Flag Overseas Nationality
  const isOverseas = overseasPlayers.has(p.name);

  return {
    ...p,
    role: fixedRole,
    is_overseas: isOverseas
  };
});

// Output the fixed file
const outputPath = path.join(__dirname, 'players_fixed.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));
console.log(`Successfully cleaned ${cleanedData.length} players and saved to players_fixed.json!`);