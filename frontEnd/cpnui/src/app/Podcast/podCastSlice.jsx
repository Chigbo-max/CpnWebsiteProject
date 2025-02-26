import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  selectedTopic: '',
  podcasts: [
    {
      title: "What language are you speaking?",
      topic: "Your accent gives you away",
      embedUrl: "/episode/5l3Qlf25FxAblRXsKtEkQC?utm_source=generator"
    },
    {
      title: "Be wise",
      topic: "Loyal But Integral",
      embedUrl: "/episode/3kXs6Kai8FvBNhHQPm1fK7?utm_source=generator"
    },


    {
        title: "Stop complaining, get creative",
        topic: "Get Creative",
        embedUrl: "episode/1pP5aWWf4QiU5DxpJYmdDV?utm_source=generator"
      },


      {
        title: "Having the right attitude",
        topic: "Likeable Dreamable",
        embedUrl: "/episode/5eFIUTiUJa9eK8jdsJJeNB?utm_source=generato"
      },


      {
        title: "Creating the right standards for your successor",
        topic: "Hand over or Hot mess",
        embedUrl: "/episode/7yM59d8ECRNZMkTh2UGG6f?utm_source=generator"
      },


      {
        title: "We are all eligible",
        topic: "The criteria is sheer love",
        embedUrl: "/episode/3kXs6Kai8FvBNhHQPm1fK7?utm_source=generator"
      },

      {
        title: "Second episode of the series on money, morals, ethics",
        topic: "Money, Morals & Ethics-others may",
        embedUrl: "/episode/3kXs6Kai8FvBNhHQPm1fK7?utm_source=generator"
      },
      {
        title: "Devoted things",
        topic: "Money, Morals & Ethics",
        embedUrl: "/episode/49aC5KuXIClTPtJcWelQaP?utm_source=generator"
      },


      {
        title: "Loudest is not necessarily strongest-2",
        topic: "Loudest is not necessarily stronges-2",
        embedUrl: "/episode/0HOu4Q9KR55kDNJNxidnkZ?utm_source=generator"
      },


      {
        title: "Loudest not Strongest-Pt1",
        topic: "Loudest not Strongest-Pt1",
        embedUrl: "/episode/1xy7ohJG4Q6tBn1WRMV8LH?utm_source=generator"
      },

      {
        title: "God's ways are not our ways",
        topic: "The Plan is to Collect",
        embedUrl: "/episode/1y1BVcVMuFES7vnHVEdqMO?utm_source=generator"
      },


      {
        title: "Take the necessary steps",
        topic: "Bold Moves-Finale",
        embedUrl: "/episode/2LabGZj5bsn1TIBMFyjWnM?utm_source=generator"
      },


      {
        title: "Alarmed, Terrified, Shaken",
        topic: "Alarmed, Terrified, Shaken",
        embedUrl: "/episode/7Db34OJCZ1HxXiSyd6kNg6?utm_source=generator"
      },


      {
        title: "If it costs everythin, its taking too much!",
        topic: "At what cost?",
        embedUrl: "/episode/0eVy5OGGabMPDbcxLQ81Rg?utm_source=generator"
      },

      {
        title: "Opposition is Resilient",
        topic: "A Trap, A Trick, A Test-3",
        embedUrl: "/episode/2yfLdFMOaXZ5bGFX3FvyNd?utm_source=generator"
      },


      {
        title: "Outsmart them",
        topic: "A Trap, A Trick, A Test-2",
        embedUrl: "/episode/6a5XP5Jk35kU2fOt80yLWs?utm_source=generator"
      },


      {
        title: "Face Facts",
        topic: "A Trap, A Trick, A Test",
        embedUrl: "/episode/5xyqFoauDYbCFFbMbPrtkr?utm_source=generator"
      },


      {
        title: "Due Diligence",
        topic: "Bold Moves-2",
        embedUrl: "/episode/6qoDA6BylsIdhPG7op3dRq?utm_source=generator"
      },


      {
        title: "Stay on the path",
        topic: "The Road Less Travelled",
        embedUrl: "/episode/3gH4t3Eobk7LqqGrzvDhH6?utm_source=generator"
      },


      {
        title: "The right steps and approach to something new",
        topic: "Bold Moves",
        embedUrl: "/episode/5koVPxrFiadhzIyIwldhos?utm_source=generator"
      },


      {
        title: "Assurance",
        topic: "Strong Convictions",
        embedUrl: "/episode/48aiO4Qn2a5SlcklbcnRlr?utm_source=generator"
      },

      {
        title: "All things",
        topic: "Favourable Structures",
        embedUrl: "/episode/7FUSMpCC1MJCaBMKfBt7CR?utm_source=generator"
      },


      {
        title: "You will be accepted",
        topic: "If you do well",
        embedUrl: "/episode/1gfGg4kf7BXWWANYRt8Jiw?utm_source=generator"
      },



      {
        title: "For People's sake...",
        topic: "When You Should Speak",
        embedUrl: "/episode/795wYEZQ534EER27uedhtq?utm_source=generator"
      },


      {
        title: "God is with you",
        topic: "Managing Up",
        embedUrl: "/episode/4MUS2TtC1zaQNt4wg2UsUh?utm_source=generator"
      },

      {
        title: "Ant-Lessons",
        topic: "Managing Self",
        embedUrl: "/episode/0C1vpg4CNJdGoVUW7mO0BP?utm_source=generator"
      },


      {
        title: "Stop Digging",
        topic: "Wells without Water",
        embedUrl: "/episode/66hDUDGlGfC51LTqvkZNzU?utm_source=generator"
      },

      {
        title: "Fill in the gaps",
        topic: "Mind the Gap",
        embedUrl: "/episode/7d6ZCyrjW2tjpA84tkXSmN?utm_source=generator"
      },


      {
        title: "Heavy lifters",
        topic: "A Special message to CPN coomunity- in these times",
        embedUrl: "/episode/1akGiFppXQ0wS72uJd9HIM?utm_source=generator"
      },


      {
        title: "We move!!!",
        topic: "Arrive, though exhausted",
        embedUrl: "/episode/7EHJ1rg1OPfZYptJnZg1RZ?utm_source=generator"
      },


      {
        title: "Innocuous or Intentional",
        topic: "Don't Play Games with Me",
        embedUrl: "/episode/1PCTAQaOx1ts66IEYOE6OH?utm_source=generator"
      },


      {
        title: "Let's play!",
        topic: "Concentration Concentration",
        embedUrl: "/episode/5Xzq3TRQ700VVWtsaZwFwJ?utm_source=generator"
      },


      {
        title: "Crushing armies...",
        topic: "By my God",
        embedUrl: "/episode/3TX6dFDEqIkE839VZisOne?utm_source=generator"
      },


      {
        title: "With all your heart",
        topic: "Skin in The Game-2",
        embedUrl: "/episode/0kmO4VNdFpGaG4RT2acMQ4?utm_source=generator"
      },


      {
        title: "Here for the money",
        topic: "Skin in The Game",
        embedUrl: "/episode/3kXs6Kai8FvBNhHQPm1fK7?utm_source=generator"
      },

      {
        title: "When you goof...",
        topic: "Willing Troops",
        embedUrl: "/episode/1xdgXaDiGJW4sD1C1fXeux?utm_source=generator"
      },


      {
        title: "Rest...",
        topic: "Rest",
        embedUrl: "/episode/2c43uPj0Hj1vYq27gDoTSX?utm_source=generator"
      },


      {
        title: "We have The Light of Life",
        topic: "Dark Times",
        embedUrl: "/episode/4KQdHGBEIq2EQzk114inZ5?utm_source=generator"
      },


      {
        title: "Retreat when necessary",
        topic: "Burn out is Real, Rest is a Requirement",
        embedUrl: "/episode/2B9jNSLfLcoGmV4QxFV5C9?utm_source=generator"
      },


      {
        title: "Apart from Him, you can do nothing",
        topic: "Success Factor",
        embedUrl: "/episode/2SIKhD1JcmD6zqwhuSfIwo?utm_source=generator"
      },


      {
        title: "Stop the tantrums and trickery",
        topic: "God's standards",
        embedUrl: "/episode/5fMfMGiAA36gthw8zo7TAk?utm_source=generator"
      },


      {
        title:"Willing troops",
        topic: "Open to Controversy",
        embedUrl: "/episode/67qiXc3L6gYbsf1WU73ere?utm_source=generator"
      },

      {
        title: "God sees you",
        topic: "Go back to your Boss",
        embedUrl: "/episode/3kXs6Kai8FvBNhHQPm1fK7?utm_source=generator"
      },

      {
        title: "Having done all..",
        topic: "Crisis Demands...",
        embedUrl: "/episode/7LzV2ooid7caNqdDPvRqmD?utm_source=generator"
      },


      {
        title: "Best possible outcome",
        topic: "Critical Path",
        embedUrl: "/episode/1JM7ZthOZDvM2AAXJ0J6fV?utm_source=generator"
      },


      {
        title: "Intersection of Surrender",
        topic: "Point of Peace",
        embedUrl: "/episode/3kXs6Kai8FvBNhHQPm1fK7?utm_source=generator"
      },

      {
        title: "Let your outcome lead the message",
        topic: "Neutral Tone",
        embedUrl: "/episode/65lTdyVsb1bfAeFv4zYstg?utm_source=generator"
      },


      {
        title: "Work for purpose, make the timely switch.",
        topic: "While it is Day...",
        embedUrl: "/episode/5xHMYtJKMdDQrQRMEDjH81?utm_source=generator"
      },


      {
        title: "It is God",
        topic: "Show God's working",
        embedUrl: "/episode/5cIXhdtKJRXnKblEgnh1Xt?utm_source=generator"
      },


      {
        title: "Don't get tired",
        topic: "Restless and Relentless",
        embedUrl: "/episode/7EMdBJjeW1jJPBMAcl4a1C?utm_source=generator"
      },


      {
        title: "When your results are irrefutable, your growth and promotion will be inevitable",
        topic: "Clear evidence",
        embedUrl: "/episode/4b4TI54PWHPkEe2uq21umu?utm_source=generator"
      },


      {
        title: "Pretence is the first colour of betrayal",
        topic: "Don't play games with me",
        embedUrl: "/episode/1McOK33fwKlMFUix25eeBE?utm_source=generator"
      },


      {
        title: "stand",
        topic: "Having done all...",
        embedUrl: "/episode/6nbgS4FWKte7JKEd6Px1c2?utm_source=generator"
      },


      {
        title: "Hold your peace",
        topic: "Terms and conditions don't apply",
        embedUrl: "/episode/6PRK80uE9AmuOaqotjnH8q?utm_source=generator"
      },


      {
        title: "Out-standing behaviour",
        topic: "Haters can Praise",
        embedUrl: "/episode/6va6VD58KZehGWS6VzbI8L?utm_source=generator"
      },

      {
        title: "Get up!",
        topic: "No one else is coming",
        embedUrl: "/episode/7amL2LTXWtveZ6azG5lNq5?utm_source=generator"
      },


      {
        title: "Who's on your side?",
        topic: "Taking sides",
        embedUrl: "/episode/6ADtyzUSFy2T0EvXNGcqoe?utm_source=generator"
      },


      {
        title: "Know your work and worth",
        topic: "Watching closely",
        embedUrl: "/episode/6MYLdbSnVWMjuBtQvgQAsm?utm_source=generator"
      },


      {
        title: "Don't stop talking about it",
        topic: "Make it loud",
        embedUrl: "/episode/7bHFHqIJQcTIJq5nSHrqus?utm_source=generator"
      },


      {
        title: "Avoid sub-par and shoddy work.",
        topic: "The dangers of shoddy work",
        embedUrl: "/episode/5qq0wt86ZGl7p3N77fYcps?utm_source=generator"
      },


      {
        title: "The reason for the desired results",
        topic: "Why?",
        embedUrl: "/episode/1nesuqbCYq5A4vR8aNXrQm?utm_source=generator"
      },


      {
        title: "Get it right inside and out.",
        topic: "The right intentions",
        embedUrl: "/episode/5bFTpDMu6opsgUkgrOHaaZ?utm_source=generator"
      },


      {
        title: "Count the cost and pay the price",
        topic: "Count the cost!",
        embedUrl: "/episode/2sc3iiWfYw481OgBHa8mNZ?utm_source=generator"
      },


      {
        title: "Experience is all-encompassing.",
        topic: "The Power of Experience",
        embedUrl: "/episode/1VPWU8kosPJS5GnK2RMroF?utm_source=generator"
      },


      {
        title: "Live your Legacy, don't leave it!",
        topic: "Live your Legacy",
        embedUrl: "/episode/4XCEUh6xalItUp0dWgpiYl?utm_source=generator"
      },


      {
        title: "Do it!",
        topic: "Wrapping it up",
        embedUrl: "/episode/12Nyaggzjwf4EG9a4g08hQ?utm_source=generator"
      },


      {
        title: "Engage across and not only as you deem relevant",
        topic: "Stakeholders across Board",
        embedUrl: "/episode/4UR7VurvQcj1tr1Zpu9lK9?utm_source=generator"
      },


      {
        title: "Way to wrap up the year!",
        topic: "The Ultimate Approval",
        embedUrl: "/episode/4HIc8yPZTCzJXR8fJup4jK?utm_source=generator"
      },


      {
        title: "Prepare for what you pray for.",
        topic: "New wineskines",
        embedUrl: "/episode/2FNYbXDIxLltTwWjzWDqQV?utm_source=generator"
      },


      {
        title: "The maturity of pressure",
        topic: "Sheer Pressure",
        embedUrl: "/episode/3tZ3iMLpx3pkW6grUnt1J3?utm_source=generator"
      },


      {
        title: "Right relationships are ladders, God uses men.",
        topic: "Build Relationships",
        embedUrl: "/episode/0U8tKrKs0sSXvgMabQZrgx?utm_source=generator"
      },


      {
        title: "Believe till you become",
        topic: "Faith it till you make it.",
        embedUrl: "/episode/4qghVDjvlhnQFlUQN5UN10?utm_source=generator"
      },


      {
        title: "There's a time for everything",
        topic: "Changing Times",
        embedUrl: "/episode/0WYc0ruxNsryVFrUSn1vrt?utm_source=generator"
      },

      {
        title: "Your perception of yourself influences others.",
        topic: "Inside out",
        embedUrl: "/episode/1J2sU9IbeapEeMlrCzAS7y?utm_source=generator"
      },


      {
        title: "For such a time as this",
        topic: "A redemptive force",
        embedUrl: "/episode/6vlzOaWz23eJaj9zNn8W9G?utm_source=generator"
      },


      {
        title: "God's Love encompasses me...",
        topic: "The Qualified Imoster",
        embedUrl: "/episode/21SZ7TSpY8sknS127HnRzP?utm_source=generator"
      },


      {
        title: "Approach with caution",
        topic: "Workplace Drama",
        embedUrl: "/episode/0opRkEGbR8z5NSuqe1TuiU?utm_source=generator"
      },


      {
        title: "How to respond to difficult Christians in the workplace",
        topic: "Open Arms",
        embedUrl: "/episode/4TutqaRBTAr0Wxnll0y7fC?utm_source=generator"
      },


      {
        title: "Ask Him, and whatever He says, do it!",
        topic: "Resilience, Wisdom, Obedience",
        embedUrl: "/episode/3h89R4PRiyLKYWgYdtLc9j?utm_source=generator"
      },


      {
        title: "Learn to give the credit where it is due.",
        topic: "Acknowledge Help",
        embedUrl: "/episode/4Z0dzoVv1CPoin82hMkA6d?utm_source=generator"
      },


      {
        title: "Leveraging The Help of The Holy Spirit as a Christian Professional",
        topic: "Professional Help 1&2",
        embedUrl: "/episode/5Wx3EZYBjotyzsEhWEkrH9?utm_source=generator"
      },


      {
        title: "God can do anything you know...",
        topic: "Blown away!",
        embedUrl: "/episode/3AtatD5xln9VHLiY851y0v?utm_source=generator"
      },


      {
        title: "Only God deserves your everything.",
        topic: "Best or everything.",
        embedUrl: "/episode/1tJbVDeFQ54ROD0OZJSceo?utm_source=generator"
      },


      {
        title: "Recover your life",
        topic: "Core relevance",
        embedUrl: "/episode/1qPLUREjSiE03ZoKeSQXD7?utm_source=generator"
      },


      {
        title: "Focus on your primary assignment",
        topic: "Primary assignment",
        embedUrl: "/episode/6eRdM323HezAoMKjHoa91K?utm_source=generator"
      },


      {
        title: "Outclass your peers",
        topic: "Brimming with intelligence",
        embedUrl: "/episode/2LbAtdbXagOv1KyXnI8NAb?utm_source=generator"
      },

      {
        title: "God's plan always leads to an expected end.",
        topic: "Dead End",
        embedUrl: "/episode/6oC8ec0lX3z0rLUBYuEHuS?utm_source=generator"
      },


      {
        title: "We have hope because God never fails",
        topic: "We have Hope...",
        embedUrl: "/episode/5gErEysmTavDi1A4HWWuS2?utm_source=generator"
      },


      {
        title: "Avoid dim-witted and ill-witted company.",
        topic: "ill-witted company",
        embedUrl: "/episode/2jxNDM82kfVceKFYJApTSz?utm_source=generator"
      },


      {
        title: "Get over it!",
        topic: "Getting past guilt when you goof",
        embedUrl: "/episode/6DSHuatjKGkrr20Fhiv490?utm_source=generator"
      },


      {
        title: "Staying positive in a toxic environment and Bible expamples for reference.",
        topic: "Positivity over Toxicity",
        embedUrl: "/episode/2ZlUQ1ZE01jyb6Y0Wz7wYX?utm_source=generator"
      },


      {
        title: "It's appraisal season, it's time to balance and prioritise!",
        topic: "Balance and Priorities",
        embedUrl: "/episode/0L9qQg5uWFOsPAmHTTw7ze?utm_source=generator"
      },


      {
        title: "Protecting Kingdom Interests",
        topic: "Protecting Kingdom Interests",
        embedUrl: "/episode/62b8LlfcTfTCC3jcIzDFBe?utm_source=generator"
      },


      {
        title: "God's Presence and Power",
        topic: "The Distinguishing Factor",
        embedUrl: "/episode/7zFP5KOxJQFhFxD6pzNeu0?utm_source=generator"
      },


      {
        title: "Finding strength in God in difficult times",
        topic: "Find Strength in God",
        embedUrl: "/episode/6Ul62S8mBLYmBbJ09dyufL?utm_source=generator"
      },


      {
        title: "Set the example",
        topic: "Set the example-2",
        embedUrl: "/episode/3kXs6Kai8FvBNhHQPm1fK7?utm_source=generator"
      },

      {
        title: "Set the example",
        topic: "Set the example",
        embedUrl: "/episode/3teOSmAyPbPuLsF2DMa5iS?utm_source=generator"
      },

      {
        title: "Nothing is beyond reach",
        topic: "God can do anything you know!",
        embedUrl: "/episode/3paMrnFIdhmHfTTpSy1Ogm?utm_source=generator"
      },

      {
        title: "Ain't no stopping, God is on the move!",
        topic: "Go for it!",
        embedUrl: "/episode/2vaCdhfmbt637E40tVznTa?utm_source=generator"
      },

      {
        title: "Fragrant victory",
        topic: "Setting the tone",
        embedUrl: "/episode/2I08Wl3CF96CmZEdv848F0?utm_source=generator"
      },



  ]
};

const podcastSlice = createSlice({
  name: 'podcasts',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload.toLowerCase();
      state.selectedTopic = '';
    },
    setSelectedTopic: (state, action) => {
      state.selectedTopic = action.payload.toLowerCase();
      state.searchQuery = '';
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedTopic = '';
    }
  }
});

export const { setSearchQuery, setSelectedTopic, clearFilters } = podcastSlice.actions;
export default podcastSlice.reducer;