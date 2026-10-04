const mongoose = require("mongoose");
require("dotenv").config();

const Recipe = require("./models/Recipe");

// --------------------------------------------------
// HELPER
// --------------------------------------------------

const r = (
  name,
  category,
  cuisine,
  area,
  description,
  ingredients,
  instructions,
  rating,
  cookingTime,
  serving,
  difficulty
) => ({
  name,
  category,
  cuisine,
  area,
  description,
  ingredients,
  instructions,
  rating,
  cookingTime,
  serving,
  difficulty,
  image: "",
  imageSource: ""
});

// --------------------------------------------------
// 60 RECIPES
// --------------------------------------------------

const recipes = [

  // ==================================================
  // SOUTH INDIAN - 20
  // ==================================================

  r(
    "Idli",
    "South Indian",
    "South Indian",
    "Tamil Nadu",
    "Soft and fluffy steamed rice cakes made from fermented rice and urad dal batter.",
    ["Rice", "Urad dal", "Salt", "Water"],
    [
      "Step 1: Wash rice and urad dal separately and soak them in water for about 4–6 hours.",
      "Step 2: Grind the soaked urad dal until smooth and fluffy.",
      "Step 3: Grind the rice into a slightly coarse batter and combine it with the urad dal batter.",
      "Step 4: Add salt, mix well and keep the batter covered in a warm place overnight for fermentation.",
      "Step 5: Grease the idli moulds and pour the fermented batter into each mould.",
      "Step 6: Steam the idlis for about 10–12 minutes until they become soft and cooked.",
      "Step 7: Allow them to cool for a minute, remove them carefully and serve hot with sambar and chutney."
    ],
    4.8, 30, 4, "Easy"
  ),

  r(
    "Masala Dosa",
    "South Indian",
    "South Indian",
    "Karnataka",
    "Crispy dosa filled with a flavorful spiced potato mixture.",
    ["Rice", "Urad dal", "Potatoes", "Onion", "Green chilli", "Mustard seeds", "Curry leaves", "Salt", "Oil"],
    [
      "Step 1: Soak rice and urad dal separately for 4–6 hours.",
      "Step 2: Grind them into a smooth dosa batter, mix with salt and ferment overnight.",
      "Step 3: Boil potatoes, peel them and roughly mash them.",
      "Step 4: Prepare the filling by tempering mustard seeds and curry leaves, then cooking onion, green chilli and mashed potatoes with salt.",
      "Step 5: Heat a dosa tawa and spread a thin layer of fermented batter into a large circle.",
      "Step 6: Drizzle a little oil around the dosa and cook until the bottom becomes golden and crisp.",
      "Step 7: Place the potato filling in the centre, fold the dosa and serve hot with chutney and sambar."
    ],
    4.9, 40, 4, "Medium"
  ),

  r(
    "Plain Dosa",
    "South Indian",
    "South Indian",
    "South India",
    "Thin and crispy fermented rice and lentil crepe.",
    ["Rice", "Urad dal", "Salt", "Water", "Oil"],
    [
      "Step 1: Wash and soak rice and urad dal separately for several hours.",
      "Step 2: Grind both ingredients into a smooth batter and combine them.",
      "Step 3: Add salt and leave the batter covered overnight for fermentation.",
      "Step 4: Heat a dosa tawa and lightly grease it.",
      "Step 5: Pour a ladleful of batter and spread it into a thin circular layer.",
      "Step 6: Drizzle a little oil and cook until the dosa becomes crisp and golden.",
      "Step 7: Fold the dosa and serve immediately with chutney or sambar."
    ],
    4.7, 30, 4, "Easy"
  ),

  r(
    "Vada",
    "South Indian",
    "South Indian",
    "Tamil Nadu",
    "Crispy outside and soft inside deep-fried urad dal fritters.",
    ["Urad dal", "Green chilli", "Ginger", "Curry leaves", "Salt", "Oil"],
    [
      "Step 1: Wash and soak urad dal for about 4 hours.",
      "Step 2: Drain the water completely and grind the dal into a thick fluffy batter.",
      "Step 3: Add chopped green chilli, ginger, curry leaves and salt.",
      "Step 4: Mix the batter well and keep your hands slightly wet for shaping.",
      "Step 5: Heat oil in a deep pan over medium heat.",
      "Step 6: Take a portion of batter, shape it into a ring and carefully place it into the hot oil.",
      "Step 7: Fry until golden and crisp on both sides, then drain and serve hot."
    ],
    4.7, 35, 4, "Medium"
  ),

  r(
    "Pongal",
    "South Indian",
    "South Indian",
    "Tamil Nadu",
    "Comforting rice and lentil dish flavored with pepper, cumin and ghee.",
    ["Rice", "Moong dal", "Ghee", "Black pepper", "Cumin", "Cashews", "Ginger", "Salt"],
    [
      "Step 1: Wash rice and moong dal thoroughly.",
      "Step 2: Lightly roast the moong dal until it gives a pleasant aroma.",
      "Step 3: Cook the rice and dal together with enough water until very soft.",
      "Step 4: Heat ghee in a pan and fry cashews, cumin, black pepper and chopped ginger.",
      "Step 5: Add the tempering to the cooked rice and dal mixture.",
      "Step 6: Add salt and mix everything thoroughly.",
      "Step 7: Simmer for a few minutes until the pongal reaches a soft creamy consistency and serve hot."
    ],
    4.7, 30, 4, "Easy"
  ),

  r(
    "Upma",
    "South Indian",
    "South Indian",
    "South India",
    "Savory breakfast made with roasted semolina and vegetables.",
    ["Semolina", "Onion", "Green chilli", "Mustard seeds", "Curry leaves", "Water", "Salt", "Oil"],
    [
      "Step 1: Dry roast the semolina on medium heat until lightly aromatic and keep it aside.",
      "Step 2: Heat oil in a pan and add mustard seeds.",
      "Step 3: Add curry leaves, green chilli and chopped onion and sauté until the onion becomes soft.",
      "Step 4: Add the required amount of water and salt and bring it to a boil.",
      "Step 5: Lower the flame and slowly add roasted semolina while continuously stirring.",
      "Step 6: Keep stirring to prevent lumps from forming.",
      "Step 7: Cook until the water is absorbed and the upma becomes soft and fluffy."
    ],
    4.6, 25, 4, "Easy"
  ),

  r(
    "Uttapam",
    "South Indian",
    "South Indian",
    "Tamil Nadu",
    "Thick soft dosa topped with fresh vegetables.",
    ["Dosa batter", "Onion", "Tomato", "Green chilli", "Coriander", "Salt", "Oil"],
    [
      "Step 1: Prepare or use fermented dosa batter and adjust its consistency if necessary.",
      "Step 2: Finely chop onion, tomato, green chilli and coriander.",
      "Step 3: Heat a tawa over medium heat and lightly grease it.",
      "Step 4: Pour a ladleful of batter and spread it only slightly to keep the uttapam thick.",
      "Step 5: Sprinkle the chopped vegetables evenly over the surface.",
      "Step 6: Drizzle a little oil around the edges and cook until the bottom becomes golden.",
      "Step 7: Flip carefully and cook the other side before serving hot with chutney."
    ],
    4.6, 25, 4, "Easy"
  ),

  r(
    "Pesarattu",
    "South Indian",
    "South Indian",
    "Andhra Pradesh",
    "Healthy green gram dosa popular in Andhra Pradesh.",
    ["Green gram", "Green chilli", "Ginger", "Onion", "Cumin", "Salt", "Oil"],
    [
      "Step 1: Wash and soak green gram for 4–6 hours.",
      "Step 2: Drain the water and grind the green gram with ginger, green chilli, cumin and salt.",
      "Step 3: Add enough water to make a smooth but moderately thick batter.",
      "Step 4: Heat a dosa tawa and lightly grease it.",
      "Step 5: Pour the batter and spread it into a thin circular dosa.",
      "Step 6: Sprinkle finely chopped onion over the top and drizzle a little oil.",
      "Step 7: Cook until crisp and golden, then fold and serve hot."
    ],
    4.7, 30, 4, "Easy"
  ),

  r(
    "Poori",
    "South Indian",
    "Indian",
    "South India",
    "Deep-fried puffed wheat bread served with curry.",
    ["Wheat flour", "Salt", "Water", "Oil"],
    [
      "Step 1: Add wheat flour and salt to a mixing bowl.",
      "Step 2: Gradually add water and knead into a firm dough.",
      "Step 3: Cover the dough and rest it for about 15–20 minutes.",
      "Step 4: Divide the dough into small equal portions and roll them into smooth balls.",
      "Step 5: Roll each ball into a small circular disc without making it too thin.",
      "Step 6: Heat oil and carefully slide one poori into the hot oil.",
      "Step 7: Gently press the surface with a spoon so it puffs up, fry both sides until golden and serve hot."
    ],
    4.7, 30, 4, "Easy"
  ),

  r(
    "Sambar",
    "South Indian",
    "South Indian",
    "Tamil Nadu",
    "Spicy and tangy lentil and vegetable stew.",
    ["Toor dal", "Drumstick", "Carrot", "Tomato", "Onion", "Tamarind", "Sambar powder", "Salt"],
    [
      "Step 1: Wash toor dal and pressure cook it until completely soft.",
      "Step 2: Soak tamarind in warm water and extract the juice.",
      "Step 3: Cut the vegetables into medium-sized pieces.",
      "Step 4: Cook the vegetables with tomato, onion and enough water until tender.",
      "Step 5: Add cooked dal, tamarind water, sambar powder and salt.",
      "Step 6: Mix well and simmer until the flavours combine and the sambar reaches the desired consistency.",
      "Step 7: Prepare a tempering with oil, mustard seeds and curry leaves and add it to the sambar before serving."
    ],
    4.8, 40, 5, "Medium"
  ),

  r(
    "Rasam",
    "South Indian",
    "South Indian",
    "Tamil Nadu",
    "Light spicy and tangy soup made with tomato and tamarind.",
    ["Tomato", "Tamarind", "Rasam powder", "Cumin", "Black pepper", "Curry leaves", "Salt"],
    [
      "Step 1: Soak tamarind in warm water and extract the juice.",
      "Step 2: Crush or chop tomatoes and cook them with the tamarind water.",
      "Step 3: Add rasam powder, salt and a little water.",
      "Step 4: Simmer the mixture until the raw smell of tamarind disappears.",
      "Step 5: Add cooked dal water if desired and bring the rasam close to a boil.",
      "Step 6: Prepare a tempering using oil, cumin, black pepper and curry leaves.",
      "Step 7: Pour the tempering over the rasam, mix gently and serve hot."
    ],
    4.7, 25, 4, "Easy"
  ),

  r(
    "Lemon Rice",
    "South Indian",
    "South Indian",
    "South India",
    "Tangy rice flavored with lemon juice and tempered spices.",
    ["Cooked rice", "Lemon", "Peanuts", "Mustard seeds", "Green chilli", "Curry leaves", "Turmeric", "Salt"],
    [
      "Step 1: Cook the rice and spread it on a plate to cool completely.",
      "Step 2: Heat oil in a pan and add mustard seeds.",
      "Step 3: Add peanuts, green chilli and curry leaves and fry until the peanuts become crisp.",
      "Step 4: Add turmeric and switch the flame to low.",
      "Step 5: Add the cooled rice and salt and mix gently.",
      "Step 6: Turn off the heat and allow the rice to cool slightly.",
      "Step 7: Add fresh lemon juice, mix well and serve."
    ],
    4.6, 20, 4, "Easy"
  ),

  r(
    "Tamarind Rice",
    "South Indian",
    "South Indian",
    "Andhra Pradesh",
    "Tangy and spicy rice prepared with tamarind and roasted spices.",
    ["Rice", "Tamarind", "Peanuts", "Sesame", "Red chilli", "Curry leaves", "Salt"],
    [
      "Step 1: Cook the rice until the grains remain separate and allow it to cool.",
      "Step 2: Soak tamarind and extract a thick tamarind juice.",
      "Step 3: Cook the tamarind juice with chilli and spices until it becomes thick.",
      "Step 4: Roast sesame seeds and prepare the required spice mixture.",
      "Step 5: Heat oil and prepare a tempering with peanuts, red chilli and curry leaves.",
      "Step 6: Mix the tamarind paste and tempering with the cooled rice.",
      "Step 7: Rest the rice for a short time so the flavours develop before serving."
    ],
    4.7, 30, 4, "Medium"
  ),

  r(
    "Curd Rice",
    "South Indian",
    "South Indian",
    "South India",
    "Cooling rice mixed with curd and tempered spices.",
    ["Cooked rice", "Curd", "Milk", "Mustard seeds", "Green chilli", "Curry leaves", "Salt"],
    [
      "Step 1: Cook rice until soft and allow it to cool to room temperature.",
      "Step 2: Mash the rice gently so there are no large lumps.",
      "Step 3: Add curd, a little milk and salt and mix thoroughly.",
      "Step 4: Heat oil in a small pan and add mustard seeds.",
      "Step 5: Add green chilli and curry leaves and sauté briefly.",
      "Step 6: Pour the tempering over the curd rice and mix gently.",
      "Step 7: Chill slightly if desired and serve fresh."
    ],
    4.7, 15, 4, "Easy"
  ),

  r(
    "Tomato Rice",
    "South Indian",
    "South Indian",
    "South India",
    "Flavorful rice cooked with tomatoes and aromatic spices.",
    ["Rice", "Tomato", "Onion", "Green chilli", "Ginger", "Garam masala", "Salt"],
    [
      "Step 1: Cook rice separately and keep it aside to cool.",
      "Step 2: Heat oil and sauté chopped onion, ginger and green chilli.",
      "Step 3: Add chopped tomatoes and cook until they become soft.",
      "Step 4: Add turmeric, garam masala and salt.",
      "Step 5: Cook the tomato mixture until it becomes thick and the oil starts separating.",
      "Step 6: Add cooked rice and gently mix until every grain is coated.",
      "Step 7: Cook for another 2–3 minutes and serve hot."
    ],
    4.6, 30, 4, "Easy"
  ),

  r(
    "Bisi Bele Bath",
    "South Indian",
    "South Indian",
    "Karnataka",
    "Spicy rice, lentil and vegetable dish from Karnataka.",
    ["Rice", "Toor dal", "Vegetables", "Tamarind", "Bisi bele bath powder", "Ghee", "Salt"],
    [
      "Step 1: Wash rice and toor dal and cook them together until soft.",
      "Step 2: Chop vegetables such as carrot, beans and potato into small pieces.",
      "Step 3: Cook the vegetables separately until tender.",
      "Step 4: Add the cooked rice and dal to the vegetables.",
      "Step 5: Add tamarind extract, bisi bele bath powder and salt.",
      "Step 6: Simmer on low heat until the mixture becomes thick and well combined.",
      "Step 7: Finish with a spoonful of ghee and serve hot."
    ],
    4.8, 45, 5, "Medium"
  ),

  r(
    "Pulihora",
    "South Indian",
    "South Indian",
    "Andhra Pradesh",
    "Traditional Andhra-style tamarind rice with a spicy tempering.",
    ["Rice", "Tamarind", "Peanuts", "Green chilli", "Red chilli", "Curry leaves", "Salt"],
    [
      "Step 1: Cook rice and spread it on a wide plate to cool.",
      "Step 2: Soak tamarind and extract a thick juice.",
      "Step 3: Cook the tamarind juice with spices until it becomes a thick paste.",
      "Step 4: Heat oil and fry peanuts, red chilli, green chilli and curry leaves.",
      "Step 5: Add the tamarind paste to the tempering and cook briefly.",
      "Step 6: Add the mixture to the cooled rice and combine gently.",
      "Step 7: Allow the pulihora to rest for some time before serving."
    ],
    4.7, 30, 4, "Easy"
  ),

  r(
    "Appam",
    "South Indian",
    "South Indian",
    "Kerala",
    "Soft-centered and crispy-edged fermented rice pancake.",
    ["Rice", "Coconut milk", "Yeast", "Sugar", "Salt"],
    [
      "Step 1: Wash and soak rice for several hours.",
      "Step 2: Grind the rice into a smooth batter using coconut milk or water.",
      "Step 3: Add yeast, sugar and salt and mix thoroughly.",
      "Step 4: Cover the batter and allow it to ferment until slightly bubbly.",
      "Step 5: Heat an appam pan and pour a ladleful of batter into the centre.",
      "Step 6: Lift the pan and gently swirl it so the batter spreads around the sides.",
      "Step 7: Cover and cook until the centre is soft and the edges become lightly crisp."
    ],
    4.7, 40, 4, "Medium"
  ),

  r(
    "Chicken Chettinad",
    "South Indian",
    "South Indian",
    "Tamil Nadu",
    "Spicy Chettinad chicken curry prepared with roasted aromatic spices.",
    ["Chicken", "Onion", "Tomato", "Coconut", "Black pepper", "Fennel", "Cinnamon", "Salt"],
    [
      "Step 1: Clean the chicken and marinate it with salt and basic spices.",
      "Step 2: Dry roast pepper, fennel, cinnamon and other whole spices until fragrant.",
      "Step 3: Grind the roasted spices with coconut into a coarse paste.",
      "Step 4: Heat oil and sauté sliced onion until golden.",
      "Step 5: Add tomato and cook until soft, then add the ground spice paste.",
      "Step 6: Add chicken and mix thoroughly so it is coated with the masala.",
      "Step 7: Add water, cover and simmer until the chicken is tender and the curry thickens."
    ],
    4.9, 55, 4, "Medium"
  ),

  r(
    "Andhra Chicken Curry",
    "South Indian",
    "Andhra",
    "Andhra Pradesh",
    "Spicy Andhra-style chicken curry with bold chilli and aromatic spices.",
    ["Chicken", "Onion", "Tomato", "Green chilli", "Red chilli powder", "Garam masala", "Salt"],
    [
      "Step 1: Clean the chicken and marinate it with chilli powder, salt and turmeric.",
      "Step 2: Heat oil and sauté chopped onion and green chilli until golden.",
      "Step 3: Add ginger-garlic paste and cook until the raw smell disappears.",
      "Step 4: Add chopped tomatoes and cook until they become soft.",
      "Step 5: Add the marinated chicken and mix thoroughly with the masala.",
      "Step 6: Add water, cover and cook on medium heat until the chicken becomes tender.",
      "Step 7: Add garam masala and simmer uncovered until the curry reaches the desired consistency."
    ],
    4.8, 50, 4, "Medium"
  ),

  // ==================================================
  // NORTH INDIAN - 20
  // ==================================================

  r(
    "Butter Chicken",
    "North Indian",
    "Indian",
    "Punjab",
    "Creamy tomato-based chicken curry flavored with butter and aromatic spices.",
    ["Chicken", "Yogurt", "Tomato", "Butter", "Cream", "Garam masala", "Kasuri methi", "Salt"],
    [
      "Step 1: Marinate chicken with yogurt, chilli powder, ginger-garlic paste and salt.",
      "Step 2: Grill or pan-cook the chicken until lightly charred and fully cooked.",
      "Step 3: Cook tomatoes with spices until soft and blend them into a smooth puree.",
      "Step 4: Heat butter and cook the tomato puree until the raw smell disappears.",
      "Step 5: Add garam masala and a little water and simmer the gravy.",
      "Step 6: Add the cooked chicken pieces and simmer for several minutes.",
      "Step 7: Add cream and crushed kasuri methi, mix gently and serve hot."
    ],
    4.9, 50, 4, "Medium"
  ),

  r(
    "Chicken Tikka Masala",
    "North Indian",
    "Indian",
    "Punjab",
    "Grilled chicken pieces cooked in a rich spiced tomato gravy.",
    ["Chicken", "Yogurt", "Tomato", "Onion", "Cream", "Garam masala", "Ginger-garlic paste"],
    [
      "Step 1: Cut chicken into tikka-sized pieces.",
      "Step 2: Marinate the chicken with yogurt, ginger-garlic paste and spices.",
      "Step 3: Rest the marinated chicken for at least 30 minutes.",
      "Step 4: Grill or pan-cook the chicken until browned and cooked through.",
      "Step 5: Prepare the masala by cooking onion and tomato with spices and blending until smooth.",
      "Step 6: Add the grilled chicken to the gravy and simmer for several minutes.",
      "Step 7: Add cream and garam masala, mix well and serve."
    ],
    4.8, 55, 4, "Medium"
  ),

  r(
    "Tandoori Chicken",
    "North Indian",
    "Indian",
    "Punjab",
    "Yogurt-marinated chicken roasted with traditional tandoori spices.",
    ["Chicken", "Yogurt", "Red chilli", "Garam masala", "Lemon", "Ginger-garlic paste", "Salt"],
    [
      "Step 1: Make deep cuts in the chicken pieces so the marinade can penetrate.",
      "Step 2: Mix yogurt, chilli powder, garam masala, lemon juice and ginger-garlic paste.",
      "Step 3: Coat the chicken thoroughly with the marinade.",
      "Step 4: Cover and refrigerate for several hours.",
      "Step 5: Preheat the oven or grill to high heat.",
      "Step 6: Place the chicken on the grill and roast until browned and completely cooked.",
      "Step 7: Turn the pieces occasionally and serve hot with lemon and onion."
    ],
    4.8, 60, 4, "Medium"
  ),

  r(
    "Chicken Korma",
    "North Indian",
    "Indian",
    "North India",
    "Mild creamy chicken curry made with yogurt, nuts and aromatic spices.",
    ["Chicken", "Yogurt", "Cashews", "Onion", "Cardamom", "Cinnamon", "Ginger-garlic paste", "Salt"],
    [
      "Step 1: Marinate chicken with yogurt, ginger-garlic paste and salt.",
      "Step 2: Slice onions and fry them until golden brown.",
      "Step 3: Allow the fried onions to cool and grind them with soaked cashews into a smooth paste.",
      "Step 4: Heat oil and lightly fry cardamom, cinnamon and other whole spices.",
      "Step 5: Add the marinated chicken and cook until the outside changes colour.",
      "Step 6: Add the onion-cashew paste and enough water, then simmer until the chicken becomes tender.",
      "Step 7: Adjust salt and consistency and serve the creamy korma hot."
    ],
    4.7, 55, 4, "Medium"
  ),

  r(
    "Rogan Josh",
    "North Indian",
    "Indian",
    "Kashmir",
    "Aromatic Kashmiri lamb curry with a rich red gravy.",
    ["Mutton", "Yogurt", "Kashmiri chilli", "Ginger", "Fennel", "Cardamom", "Salt"],
    [
      "Step 1: Cut the mutton into medium-sized pieces and pat them dry.",
      "Step 2: Heat oil and brown the mutton pieces lightly.",
      "Step 3: Add whole spices such as cardamom and cinnamon and sauté briefly.",
      "Step 4: Add Kashmiri chilli and ginger and mix thoroughly.",
      "Step 5: Gradually add whisked yogurt while stirring continuously.",
      "Step 6: Add water, cover and simmer until the mutton becomes tender.",
      "Step 7: Add fennel powder and adjust seasoning before serving."
    ],
    4.8, 90, 4, "Hard"
  ),

  r(
    "Chole Bhature",
    "North Indian",
    "Indian",
    "Punjab",
    "Spicy chickpea curry served with fluffy deep-fried bhature.",
    ["Chickpeas", "Onion", "Tomato", "Chole masala", "Flour", "Yogurt", "Salt", "Oil"],
    [
      "Step 1: Soak chickpeas overnight and pressure cook them until tender.",
      "Step 2: Prepare an onion-tomato masala with ginger, spices and chole masala.",
      "Step 3: Add cooked chickpeas and simmer until the gravy becomes thick.",
      "Step 4: Mix flour, yogurt, salt and water to form a soft bhature dough.",
      "Step 5: Rest the dough for about 1–2 hours.",
      "Step 6: Divide the dough into portions, roll them into discs and deep fry until puffed.",
      "Step 7: Serve hot bhature with the prepared chole."
    ],
    4.9, 60, 4, "Medium"
  ),

  r(
    "Rajma Masala",
    "North Indian",
    "Indian",
    "Punjab",
    "Red kidney beans cooked in a thick tomato and onion gravy.",
    ["Rajma", "Onion", "Tomato", "Ginger", "Garlic", "Garam masala", "Salt"],
    [
      "Step 1: Wash and soak rajma overnight.",
      "Step 2: Drain and pressure cook the rajma until soft.",
      "Step 3: Heat oil and sauté chopped onion until golden.",
      "Step 4: Add ginger-garlic paste and cook until aromatic.",
      "Step 5: Add chopped tomato and spices and cook until the masala becomes thick.",
      "Step 6: Add cooked rajma and some cooking water and simmer.",
      "Step 7: Cook until the gravy becomes thick and creamy, then serve with rice."
    ],
    4.8, 60, 4, "Easy"
  ),

  r(
    "Dal Makhani",
    "North Indian",
    "Indian",
    "Punjab",
    "Creamy black lentil dish slow-cooked with butter and cream.",
    ["Black urad dal", "Rajma", "Butter", "Cream", "Tomato", "Garam masala", "Salt"],
    [
      "Step 1: Wash and soak black urad dal and rajma overnight.",
      "Step 2: Pressure cook the soaked lentils until very soft.",
      "Step 3: Heat butter and sauté ginger-garlic paste.",
      "Step 4: Add tomato puree and cook until the oil starts separating.",
      "Step 5: Add the cooked lentils and mix thoroughly.",
      "Step 6: Simmer on low heat for a longer period, stirring occasionally.",
      "Step 7: Add cream and garam masala, simmer briefly and serve."
    ],
    4.9, 90, 5, "Medium"
  ),

  r(
    "Palak Paneer",
    "North Indian",
    "Indian",
    "North India",
    "Paneer cubes cooked in a smooth spinach gravy.",
    ["Paneer", "Spinach", "Onion", "Tomato", "Ginger", "Garlic", "Salt"],
    [
      "Step 1: Wash the spinach thoroughly and blanch it in boiling water.",
      "Step 2: Transfer the spinach to cold water to retain its fresh colour.",
      "Step 3: Blend the spinach into a smooth puree.",
      "Step 4: Sauté onion, ginger and garlic until aromatic.",
      "Step 5: Add tomato and cook until soft, then add the spinach puree.",
      "Step 6: Add paneer cubes, salt and a little water and simmer gently.",
      "Step 7: Cook for a few minutes without overcooking the spinach and serve hot."
    ],
    4.8, 40, 4, "Medium"
  ),

  r(
    "Paneer Butter Masala",
    "North Indian",
    "Indian",
    "Punjab",
    "Soft paneer cubes in a rich buttery tomato gravy.",
    ["Paneer", "Tomato", "Butter", "Cream", "Cashews", "Garam masala", "Salt"],
    [
      "Step 1: Soak cashews in warm water and blend them into a smooth paste.",
      "Step 2: Cook tomatoes with a little water until completely soft.",
      "Step 3: Blend the tomatoes into a smooth puree.",
      "Step 4: Heat butter and cook the tomato puree with spices.",
      "Step 5: Add the cashew paste and simmer until the gravy becomes creamy.",
      "Step 6: Add paneer cubes and cook gently for a few minutes.",
      "Step 7: Finish with cream and garam masala and serve hot."
    ],
    4.9, 40, 4, "Easy"
  ),

  r(
    "Shahi Paneer",
    "North Indian",
    "Indian",
    "North India",
    "Royal-style paneer curry made with nuts, cream and aromatic spices.",
    ["Paneer", "Cashews", "Onion", "Cream", "Cardamom", "Butter", "Salt"],
    [
      "Step 1: Soak cashews in warm water until softened.",
      "Step 2: Cook onion until soft and lightly golden.",
      "Step 3: Blend onion and cashews into a smooth paste.",
      "Step 4: Heat butter and gently fry cardamom and other aromatic spices.",
      "Step 5: Add the onion-cashew paste and cook until aromatic.",
      "Step 6: Add cream, salt and a little water and simmer the gravy.",
      "Step 7: Add paneer cubes, cook gently and serve hot."
    ],
    4.8, 40, 4, "Medium"
  ),

  r(
    "Kadai Paneer",
    "North Indian",
    "Indian",
    "North India",
    "Paneer cooked with bell peppers and freshly ground kadai spices.",
    ["Paneer", "Capsicum", "Tomato", "Onion", "Coriander seeds", "Red chilli", "Salt"],
    [
      "Step 1: Dry roast coriander seeds and dried red chilli until fragrant.",
      "Step 2: Crush the roasted spices into a coarse kadai masala.",
      "Step 3: Heat oil and sauté onion until lightly golden.",
      "Step 4: Add tomato and cook until soft.",
      "Step 5: Add sliced capsicum and cook while keeping it slightly crunchy.",
      "Step 6: Add paneer cubes and the prepared kadai masala.",
      "Step 7: Toss everything together for a few minutes and serve hot."
    ],
    4.8, 35, 4, "Easy"
  ),

  r(
    "Aloo Gobi",
    "North Indian",
    "Indian",
    "Punjab",
    "Classic dry curry made with potatoes and cauliflower.",
    ["Potato", "Cauliflower", "Onion", "Tomato", "Turmeric", "Cumin", "Salt"],
    [
      "Step 1: Wash and cut potatoes and cauliflower into similar-sized pieces.",
      "Step 2: Heat oil and add cumin seeds.",
      "Step 3: Add potatoes and sauté for a few minutes.",
      "Step 4: Add cauliflower, turmeric, chilli powder and salt.",
      "Step 5: Cover and cook on low heat until the vegetables become tender.",
      "Step 6: Add chopped tomato and cook uncovered until the excess moisture disappears.",
      "Step 7: Adjust seasoning and serve the dry curry hot."
    ],
    4.7, 35, 4, "Easy"
  ),

  r(
    "Malai Kofta",
    "North Indian",
    "Indian",
    "North India",
    "Soft paneer and potato dumplings served in a creamy gravy.",
    ["Paneer", "Potato", "Corn flour", "Tomato", "Cashews", "Cream", "Salt"],
    [
      "Step 1: Boil potatoes, peel them and mash them.",
      "Step 2: Mix mashed potato with grated paneer, corn flour and salt.",
      "Step 3: Shape the mixture into small smooth balls.",
      "Step 4: Deep fry the koftas until golden and crisp.",
      "Step 5: Prepare a smooth gravy using cooked tomato and cashew paste.",
      "Step 6: Add cream and seasoning and simmer until the gravy becomes rich and smooth.",
      "Step 7: Place the koftas in the gravy just before serving so they remain soft."
    ],
    4.8, 60, 4, "Hard"
  ),

  r(
    "Chana Masala",
    "North Indian",
    "Indian",
    "Punjab",
    "Spicy chickpea curry with onion, tomato and aromatic spices.",
    ["Chickpeas", "Onion", "Tomato", "Ginger", "Garlic", "Chana masala", "Salt"],
    [
      "Step 1: Soak chickpeas overnight and rinse them well.",
      "Step 2: Pressure cook the chickpeas until tender.",
      "Step 3: Heat oil and sauté onion until golden.",
      "Step 4: Add ginger-garlic paste and cook until fragrant.",
      "Step 5: Add tomatoes and chana masala and cook until the mixture becomes thick.",
      "Step 6: Add cooked chickpeas and some water and simmer until the gravy thickens.",
      "Step 7: Adjust seasoning and garnish before serving."
    ],
    4.7, 45, 4, "Easy"
  ),

  r(
    "Naan",
    "North Indian",
    "Indian",
    "Punjab",
    "Soft Indian flatbread traditionally cooked at high heat.",
    ["Flour", "Yogurt", "Yeast", "Salt", "Sugar", "Butter", "Water"],
    [
      "Step 1: Mix flour, yeast, sugar, salt and yogurt in a bowl.",
      "Step 2: Add water gradually and knead into a soft dough.",
      "Step 3: Cover and rest the dough until it becomes slightly puffy.",
      "Step 4: Divide the dough into equal portions.",
      "Step 5: Roll each portion into an oval-shaped naan.",
      "Step 6: Cook on a very hot tawa or suitable high-heat surface until bubbles and brown spots appear.",
      "Step 7: Brush with butter and serve immediately."
    ],
    4.8, 60, 4, "Medium"
  ),

  r(
    "Tandoori Roti",
    "North Indian",
    "Indian",
    "North India",
    "Whole wheat flatbread cooked at high heat for a smoky flavour.",
    ["Whole wheat flour", "Salt", "Water"],
    [
      "Step 1: Mix wheat flour and salt in a bowl.",
      "Step 2: Add water gradually and knead into a soft dough.",
      "Step 3: Rest the dough covered for about 15–20 minutes.",
      "Step 4: Divide the dough into small portions and roll each into a thin disc.",
      "Step 5: Place the roti on a hot tawa.",
      "Step 6: Cook both sides until brown spots appear and the roti is fully cooked.",
      "Step 7: Brush lightly with butter or ghee and serve hot."
    ],
    4.6, 30, 4, "Easy"
  ),

  r(
    "Jeera Rice",
    "North Indian",
    "Indian",
    "North India",
    "Fragrant basmati rice flavored with cumin seeds.",
    ["Basmati rice", "Cumin seeds", "Ghee", "Salt", "Water"],
    [
      "Step 1: Wash basmati rice several times until the water becomes relatively clear.",
      "Step 2: Soak the rice for about 20 minutes and drain.",
      "Step 3: Heat ghee and add cumin seeds.",
      "Step 4: Allow the cumin to crackle and release its aroma.",
      "Step 5: Add the drained rice and gently sauté for a minute.",
      "Step 6: Add water and salt and cook until the rice is tender.",
      "Step 7: Rest the rice covered for a few minutes, fluff gently and serve."
    ],
    4.7, 25, 4, "Easy"
  ),

  r(
    "Vegetable Biryani",
    "North Indian",
    "Indian",
    "North India",
    "Aromatic basmati rice cooked with mixed vegetables and spices.",
    ["Basmati rice", "Carrot", "Beans", "Peas", "Potato", "Biryani spices", "Onion", "Yogurt"],
    [
      "Step 1: Wash and soak basmati rice for about 20–30 minutes.",
      "Step 2: Parboil the rice with salt and whole spices until it is partly cooked.",
      "Step 3: Sauté onion until golden and keep some aside for garnish.",
      "Step 4: Cook mixed vegetables with yogurt and biryani spices.",
      "Step 5: Layer the partially cooked rice over the vegetable mixture.",
      "Step 6: Cover tightly and cook on low heat until the rice is completely tender.",
      "Step 7: Gently fluff the biryani and garnish with fried onion before serving."
    ],
    4.8, 60, 5, "Medium"
  ),

  r(
    "Samosa",
    "North Indian",
    "Indian",
    "North India",
    "Crispy pastry filled with spiced potato and peas.",
    ["Flour", "Potato", "Peas", "Green chilli", "Cumin", "Oil", "Salt"],
    [
      "Step 1: Boil potatoes, peel them and cut or mash them into small pieces.",
      "Step 2: Heat oil and temper cumin, then add green chilli and peas.",
      "Step 3: Add potatoes, salt and spices and cook the filling until well combined.",
      "Step 4: Mix flour, salt and oil and knead with water into a firm dough.",
      "Step 5: Divide the dough, roll each portion and cut it into semicircles.",
      "Step 6: Shape each semicircle into a cone, fill it with the potato mixture and seal the edges.",
      "Step 7: Deep fry the samosas over medium heat until crisp and golden."
    ],
    4.9, 45, 6, "Medium"
  ),

  // ==================================================
  // CHINESE / INDO-CHINESE - 20
  // ==================================================

  r(
    "Chicken Fried Rice",
    "Chinese",
    "Indo-Chinese",
    "China",
    "Fried rice tossed with chicken, vegetables and soy sauce.",
    ["Cooked rice", "Chicken", "Carrot", "Beans", "Spring onion", "Soy sauce", "Garlic"],
    [
      "Step 1: Cook the rice and allow it to cool completely so the grains remain separate.",
      "Step 2: Cut chicken into small bite-sized pieces.",
      "Step 3: Heat a wok over high heat and stir-fry garlic and chicken until cooked.",
      "Step 4: Add chopped carrot, beans and other vegetables and stir-fry quickly.",
      "Step 5: Add the cooled rice and toss everything together.",
      "Step 6: Add soy sauce and seasoning and stir-fry on high heat.",
      "Step 7: Finish with chopped spring onion and serve immediately."
    ],
    4.8, 30, 4, "Easy"
  ),

  r(
    "Vegetable Fried Rice",
    "Chinese",
    "Indo-Chinese",
    "China",
    "Quick fried rice packed with colorful vegetables.",
    ["Cooked rice", "Carrot", "Beans", "Capsicum", "Spring onion", "Soy sauce", "Garlic"],
    [
      "Step 1: Cook rice and cool it completely.",
      "Step 2: Heat oil in a wok over high heat.",
      "Step 3: Add garlic and sauté briefly.",
      "Step 4: Add chopped carrot, beans and capsicum and stir-fry while keeping them slightly crunchy.",
      "Step 5: Add the cooled rice and toss continuously.",
      "Step 6: Add soy sauce, salt and pepper and mix evenly.",
      "Step 7: Add spring onion and serve the fried rice hot."
    ],
    4.7, 25, 4, "Easy"
  ),

  r(
    "Schezwan Fried Rice",
    "Chinese",
    "Indo-Chinese",
    "China",
    "Spicy fried rice prepared with Schezwan sauce.",
    ["Cooked rice", "Schezwan sauce", "Carrot", "Capsicum", "Spring onion", "Garlic", "Salt"],
    [
      "Step 1: Cook and completely cool the rice.",
      "Step 2: Heat a wok and sauté chopped garlic.",
      "Step 3: Add carrot and capsicum and stir-fry on high heat.",
      "Step 4: Add Schezwan sauce and mix it with the vegetables.",
      "Step 5: Add the cooled rice and toss thoroughly.",
      "Step 6: Adjust salt and spice level and continue stir-frying for a few minutes.",
      "Step 7: Add spring onion and serve hot."
    ],
    4.8, 25, 4, "Easy"
  ),

  r(
    "Chicken Hakka Noodles",
    "Chinese",
    "Indo-Chinese",
    "China",
    "Stir-fried noodles with chicken and crunchy vegetables.",
    ["Hakka noodles", "Chicken", "Cabbage", "Carrot", "Capsicum", "Soy sauce", "Garlic"],
    [
      "Step 1: Boil the noodles according to the package instructions until just cooked.",
      "Step 2: Drain the noodles and toss them with a little oil to prevent sticking.",
      "Step 3: Heat a wok and stir-fry garlic and chicken until the chicken is cooked.",
      "Step 4: Add cabbage, carrot and capsicum and stir-fry on high heat.",
      "Step 5: Add the cooked noodles and toss carefully.",
      "Step 6: Add soy sauce and seasoning and mix everything evenly.",
      "Step 7: Finish with spring onion and serve immediately."
    ],
    4.8, 30, 4, "Easy"
  ),

  r(
    "Vegetable Hakka Noodles",
    "Chinese",
    "Indo-Chinese",
    "China",
    "Stir-fried Hakka noodles loaded with fresh vegetables.",
    ["Hakka noodles", "Cabbage", "Carrot", "Capsicum", "Spring onion", "Soy sauce", "Garlic"],
    [
      "Step 1: Boil the noodles until just tender and drain them well.",
      "Step 2: Toss the noodles with a little oil.",
      "Step 3: Heat a wok and sauté garlic.",
      "Step 4: Add cabbage, carrot and capsicum and stir-fry on high heat.",
      "Step 5: Add noodles and toss gently.",
      "Step 6: Add soy sauce, salt and pepper and mix thoroughly.",
      "Step 7: Garnish with spring onion and serve hot."
    ],
    4.7, 25, 4, "Easy"
  ),

  r(
    "Schezwan Noodles",
    "Chinese",
    "Indo-Chinese",
    "China",
    "Spicy stir-fried noodles coated with Schezwan sauce.",
    ["Noodles", "Schezwan sauce", "Cabbage", "Carrot", "Capsicum", "Garlic", "Spring onion"],
    [
      "Step 1: Boil the noodles until just cooked and drain.",
      "Step 2: Toss the noodles with a small amount of oil.",
      "Step 3: Heat a wok and sauté garlic.",
      "Step 4: Add cabbage, carrot and capsicum and stir-fry on high heat.",
      "Step 5: Add Schezwan sauce and combine with the vegetables.",
      "Step 6: Add noodles and toss continuously until evenly coated.",
      "Step 7: Garnish with spring onion and serve hot."
    ],
    4.8, 25, 4, "Easy"
  ),

  r(
    "Chilli Chicken",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Crispy chicken tossed with chilli, onion and capsicum in a spicy sauce.",
    ["Chicken", "Capsicum", "Onion", "Green chilli", "Soy sauce", "Corn flour", "Garlic"],
    [
      "Step 1: Cut chicken into bite-sized pieces.",
      "Step 2: Coat the chicken with corn flour, seasoning and a little water.",
      "Step 3: Deep fry or shallow fry the chicken until crisp and cooked.",
      "Step 4: Heat a wok and sauté garlic, green chilli and onion.",
      "Step 5: Add capsicum and stir-fry while keeping it slightly crunchy.",
      "Step 6: Add soy sauce and other sauces and mix well.",
      "Step 7: Add the fried chicken, toss on high heat and serve immediately."
    ],
    4.9, 40, 4, "Medium"
  ),

  r(
    "Chicken Manchurian",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Crispy chicken pieces tossed in a flavorful Manchurian sauce.",
    ["Chicken", "Corn flour", "Garlic", "Ginger", "Soy sauce", "Spring onion", "Salt"],
    [
      "Step 1: Mince or finely chop the chicken and mix it with corn flour and seasoning.",
      "Step 2: Shape the mixture into small balls or nuggets.",
      "Step 3: Deep fry the chicken pieces until crisp and cooked.",
      "Step 4: Heat a wok and sauté ginger and garlic.",
      "Step 5: Add soy sauce and other required sauces and cook briefly.",
      "Step 6: Add the fried chicken and toss until completely coated.",
      "Step 7: Garnish with spring onion and serve hot."
    ],
    4.8, 45, 4, "Medium"
  ),

  r(
    "Gobi Manchurian",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Crispy cauliflower florets coated in spicy Manchurian sauce.",
    ["Cauliflower", "Corn flour", "Garlic", "Ginger", "Soy sauce", "Spring onion", "Salt"],
    [
      "Step 1: Cut cauliflower into small florets and wash thoroughly.",
      "Step 2: Prepare a batter using corn flour, seasoning and water.",
      "Step 3: Coat the cauliflower florets evenly with the batter.",
      "Step 4: Deep fry until golden and crisp.",
      "Step 5: Prepare the sauce by stir-frying garlic and ginger.",
      "Step 6: Add soy sauce and seasoning, then toss the fried cauliflower in the sauce.",
      "Step 7: Garnish with spring onion and serve immediately."
    ],
    4.8, 40, 4, "Medium"
  ),

  r(
    "Paneer Manchurian",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Crispy paneer cubes tossed in a spicy Manchurian sauce.",
    ["Paneer", "Corn flour", "Garlic", "Ginger", "Soy sauce", "Spring onion", "Salt"],
    [
      "Step 1: Cut paneer into bite-sized cubes.",
      "Step 2: Coat the paneer with corn flour and seasoning.",
      "Step 3: Fry the paneer until lightly crisp and golden.",
      "Step 4: Heat a wok and sauté ginger and garlic.",
      "Step 5: Add soy sauce and the remaining Manchurian sauce ingredients.",
      "Step 6: Add fried paneer and toss until evenly coated.",
      "Step 7: Garnish with spring onion and serve hot."
    ],
    4.7, 35, 4, "Medium"
  ),

  r(
    "Chilli Paneer",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Crispy paneer tossed with peppers, onion and chilli sauce.",
    ["Paneer", "Capsicum", "Onion", "Green chilli", "Soy sauce", "Corn flour", "Garlic"],
    [
      "Step 1: Cut paneer into cubes and lightly coat with corn flour.",
      "Step 2: Fry the paneer until golden and keep it aside.",
      "Step 3: Heat a wok and sauté garlic and green chilli.",
      "Step 4: Add onion and capsicum and stir-fry on high heat.",
      "Step 5: Add soy sauce and chilli sauce and mix well.",
      "Step 6: Add the fried paneer and toss until coated.",
      "Step 7: Garnish with spring onion and serve hot."
    ],
    4.8, 35, 4, "Easy"
  ),

  r(
    "Spring Rolls",
    "Chinese",
    "Chinese",
    "China",
    "Crispy rolls filled with seasoned vegetables.",
    ["Spring roll wrappers", "Cabbage", "Carrot", "Capsicum", "Soy sauce", "Oil"],
    [
      "Step 1: Finely shred cabbage, carrot and capsicum.",
      "Step 2: Heat oil and stir-fry the vegetables on high heat.",
      "Step 3: Add soy sauce and seasoning and cook briefly.",
      "Step 4: Allow the filling to cool before assembling.",
      "Step 5: Place the filling on a spring roll wrapper and fold the sides inward.",
      "Step 6: Roll tightly and seal the edge using a flour-water paste.",
      "Step 7: Deep fry until golden and crisp, then serve hot."
    ],
    4.7, 40, 4, "Medium"
  ),

  r(
    "Hot & Sour Soup",
    "Chinese",
    "Chinese",
    "China",
    "Spicy and tangy soup with vegetables and mushrooms.",
    ["Vegetable stock", "Mushroom", "Cabbage", "Carrot", "Soy sauce", "Vinegar", "Chilli sauce"],
    [
      "Step 1: Heat vegetable stock in a large saucepan.",
      "Step 2: Add sliced mushrooms, cabbage and carrot.",
      "Step 3: Simmer until the vegetables become tender but remain slightly crisp.",
      "Step 4: Add soy sauce and chilli sauce.",
      "Step 5: Add vinegar gradually and adjust the sourness to taste.",
      "Step 6: Simmer for a few more minutes so the flavours combine.",
      "Step 7: Serve the soup immediately while hot."
    ],
    4.7, 30, 4, "Easy"
  ),

  r(
    "Manchow Soup",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Spicy vegetable soup topped with crispy fried noodles.",
    ["Vegetable stock", "Cabbage", "Carrot", "Capsicum", "Soy sauce", "Chilli sauce", "Corn flour"],
    [
      "Step 1: Heat vegetable stock in a saucepan.",
      "Step 2: Add finely chopped cabbage, carrot and capsicum.",
      "Step 3: Cook the vegetables until slightly tender.",
      "Step 4: Add soy sauce, chilli sauce and seasoning.",
      "Step 5: Mix corn flour with water and add it gradually to the soup.",
      "Step 6: Simmer until the soup becomes lightly thick.",
      "Step 7: Serve hot topped with crispy fried noodles."
    ],
    4.7, 30, 4, "Easy"
  ),

  r(
    "Sweet Corn Soup",
    "Chinese",
    "Chinese",
    "China",
    "Mild and comforting soup made with sweet corn and vegetables.",
    ["Sweet corn", "Carrot", "Beans", "Vegetable stock", "Corn flour", "Salt"],
    [
      "Step 1: Heat vegetable stock in a saucepan.",
      "Step 2: Add sweet corn, chopped carrot and beans.",
      "Step 3: Cook the vegetables until tender.",
      "Step 4: Add salt and other mild seasonings.",
      "Step 5: Mix corn flour with water to make a smooth slurry.",
      "Step 6: Slowly add the slurry while stirring continuously.",
      "Step 7: Simmer until lightly thickened and serve hot."
    ],
    4.6, 25, 4, "Easy"
  ),

  r(
    "Dragon Chicken",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Crispy spicy chicken tossed with peppers and a hot sauce.",
    ["Chicken", "Capsicum", "Dry red chilli", "Soy sauce", "Corn flour", "Garlic"],
    [
      "Step 1: Cut chicken into thin bite-sized strips.",
      "Step 2: Coat the chicken with corn flour and seasoning.",
      "Step 3: Fry the chicken until crisp and fully cooked.",
      "Step 4: Heat a wok and sauté garlic and dry red chilli.",
      "Step 5: Add sliced capsicum and stir-fry quickly.",
      "Step 6: Add soy sauce and other sauces and mix well.",
      "Step 7: Add fried chicken, toss on high heat and serve hot."
    ],
    4.8, 40, 4, "Medium"
  ),

  r(
    "Honey Chilli Potato",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Crispy potato strips tossed in a sweet and spicy honey chilli sauce.",
    ["Potatoes", "Corn flour", "Honey", "Red chilli", "Soy sauce", "Sesame seeds"],
    [
      "Step 1: Peel potatoes and cut them into thin even strips.",
      "Step 2: Rinse the potato strips and dry them thoroughly.",
      "Step 3: Coat the potatoes lightly with corn flour.",
      "Step 4: Deep fry until crisp and golden.",
      "Step 5: Prepare the sauce by stir-frying chilli and adding soy sauce.",
      "Step 6: Add honey and mix quickly to create a glossy sweet-spicy coating.",
      "Step 7: Add the fried potatoes, toss gently and garnish with sesame seeds."
    ],
    4.8, 40, 4, "Medium"
  ),

  r(
    "Kung Pao Chicken",
    "Chinese",
    "Chinese",
    "China",
    "Spicy stir-fried chicken with peanuts and vegetables.",
    ["Chicken", "Peanuts", "Capsicum", "Dry red chilli", "Soy sauce", "Ginger", "Garlic"],
    [
      "Step 1: Cut chicken into small cubes and season lightly.",
      "Step 2: Heat a wok and stir-fry the chicken until almost cooked.",
      "Step 3: Add ginger, garlic and dry red chilli.",
      "Step 4: Add capsicum and stir-fry on high heat.",
      "Step 5: Add soy sauce and the remaining sauce ingredients.",
      "Step 6: Add roasted peanuts and toss everything together.",
      "Step 7: Cook for another minute and serve hot with rice or noodles."
    ],
    4.8, 35, 4, "Medium"
  ),

  r(
    "Stir-Fried Vegetables",
    "Chinese",
    "Chinese",
    "China",
    "Colorful vegetables quickly stir-fried with light Chinese seasoning.",
    ["Broccoli", "Carrot", "Capsicum", "Beans", "Baby corn", "Soy sauce", "Salt"],
    [
      "Step 1: Wash and cut all vegetables into bite-sized pieces.",
      "Step 2: Heat a wok over high heat until very hot.",
      "Step 3: Add a little oil and start with the harder vegetables.",
      "Step 4: Add broccoli, beans, carrot and baby corn and stir-fry quickly.",
      "Step 5: Add capsicum near the end so it stays crisp.",
      "Step 6: Add soy sauce, salt and pepper and toss thoroughly.",
      "Step 7: Remove from the heat while the vegetables are still slightly crunchy and serve."
    ],
    4.6, 20, 4, "Easy"
  ),

  r(
    "American Chopsuey",
    "Chinese",
    "Indo-Chinese",
    "India",
    "Crispy fried noodles topped with sweet and tangy vegetable sauce.",
    ["Noodles", "Cabbage", "Carrot", "Capsicum", "Tomato sauce", "Corn flour", "Soy sauce"],
    [
      "Step 1: Boil the noodles until just cooked and drain them thoroughly.",
      "Step 2: Spread the noodles and allow them to dry slightly.",
      "Step 3: Deep fry the noodles until crisp and golden.",
      "Step 4: Stir-fry cabbage, carrot and capsicum in a wok.",
      "Step 5: Add tomato sauce, soy sauce and seasoning.",
      "Step 6: Add a corn flour slurry and simmer until the sauce becomes glossy and thick.",
      "Step 7: Place crispy noodles on a plate, pour the hot sauce over them and serve immediately."
    ],
    4.7, 45, 4, "Medium"
  )
];

// --------------------------------------------------
// SEED DATABASE
// --------------------------------------------------

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    console.log("\nClearing old recipe data...");

    await Recipe.deleteMany({});

    console.log("Old recipe data removed.");

    console.log(`\nInserting ${recipes.length} recipes...\n`);

    await Recipe.insertMany(recipes);

    const count = await Recipe.countDocuments();

    console.log("======================================");
    console.log("SEEDING COMPLETED");
    console.log("======================================");
    console.log(`Recipes inserted: ${recipes.length}`);
    console.log(`Recipes in MongoDB: ${count}`);
    console.log("======================================");

    if (count === 60) {
      console.log("✅ Database contains exactly 60 recipes.");
    } else {
      console.log("⚠️ Recipe count is not 60. Please check the database.");
    }

  } catch (error) {
    console.error("\n❌ Seed failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("\nMongoDB disconnected.");
  }
}

seed();