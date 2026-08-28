import fs from 'fs';

// Read the JSON file natively using fs and import.meta.url to bypass 'require'
const rawData = fs.readFileSync(new URL('./players.json', import.meta.url), 'utf8');
const players = JSON.parse(rawData);

// 1. Authentic Wicketkeepers
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

// 2. Updated Overseas Players (including the missing ones you requested)
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
  "Harry Brook", "Glenn Phillips", "Reece Topley", "Cameron Green", "Michael Bracewell", "Matheesha Pathirana",
  "Sisanda Magala", "Dwaine Pretorius", "Tristan Stubbs", "Matthew Short", "Wayne Parnell", "Lungi Ngidi",
  "Akeal Hosein", "Dasun Shanaka", "Kyle Jamieson", "Josh Hazlewood", "Finn Allen", "Fabian Allen", "Blessing Muzarabani",
  "Ricky Ponting", "Jacques Kallis", "David Hussey", "Cameron White", "Mohammad Hafeez", "Ashley Noffke",
  "Matthew Hayden", "Simon Katich", "Glenn McGrath", "B Geeves", "Darren Lehmann", "Shane Warne",
  "Luke Ronchi", "Sanath Jayasuriya", "Dominic Thornely", "Shaun Pollock", "Evin Lewis", "Faf du Plessis",
  "Kane Williamson", "Colin de Grandhomme", "Quinton de Kock", "Andre Russell", "Lockie Ferguson",
  "Rilee Rossouw", "Jake Fraser-McGurk", "Shai Hope", "Shamar Joseph", "Will Jacks", "Liam Livingstone",
  "Jhye Richardson", "Riley Meredith", "Daniel Vettori", "Marlon Samuels", "Corey Anderson",
  "Jason Behrendorff", "Dawid Malan", "Kyle Mayers", "Noor Ahmad", "Dilshan Madushanka", "Kemo Paul",
  "Junior Dala", "Javon Searles", "Colin Ingram", "Nandre Burger", "Gerald Coetzee", "Spencer Johnson",
  "Luke Wood", "Allah Ghazanfar", "David Wiese", "Jamie Overton", "George Linde", "David Payne", 
  "Chris Green", "Lizaad Williams", "Scott Kuggeleijn", "Duan Jansen", "Xavier Bartlett", "Marco Jansen", "Andrew Tye", 
  "Maheesh Theekshana", "Wiaan Mulder", "Eoin Morgan", "Alex Hales", "Ish Sodhi", "Jacob Oram", "Muttiah Muralitharan", 
  "Alzarri Joseph", "Josh Little", "N Thushara", "Cooper Connolly", "Matthew Breetzke", "Corbin Bosch", 
  "Jacob Bethell", "Karim Janat", "Eshan Malinga", "William O'Rourke", "Gulbadin Naib", "Sediqullah Atal", 
  "Jean Paul Duminy", "Shimron Hetmyer", "Shimron Hetmyer", "Sandeep Lamichhane", 
  "Mohammad Ashraful", "Mashrafe Mortaza"
]);

const cleanedData = players.map(p => {
  let fixedRole = p.role;
  
  // Rule 1: Correct Mismatched Wicketkeepers
  if (p.role === "Wicketkeeper" && !validWKs.has(p.name)) {
    fixedRole = "Batter";
  }

  return {
    ...p,
    role: fixedRole,
    is_overseas: overseasPlayers.has(p.name)
  };
});

// Write to a new JSON file
fs.writeFileSync(new URL('./players_fixed.json', import.meta.url), JSON.stringify(cleanedData, null, 2));
console.log(`Successfully cleaned ${cleanedData.length} players!`);