const RECOMMENDATION_CONFIG = {
  defaults: {
    Severe: {
      recommendationCount: 4,
    },
    Moderate: {
      recommendationCount: 3,
    },
  },
  overrides: {
    "Study Habits & Academic Motivation": {
      Moderate: [],
      Severe: [],
    },
    "Mental Health Indicators": {
      Moderate: [],
      Severe: [],
    },
  },
};

export { RECOMMENDATION_CONFIG };
