"""
survey_answer_mapping.py
========================
Predefined, deterministic answer store for the STUDENT BEHAVIOR SURVEY
dataset (synthetic_student_data.csv, ~50,000 entries).

This is SEPARATE from the job-role answer mapping (answer_mapping.py).

Dataset structure
-----------------
* ~105 Likert-scale questions (ratings 1–5) across 10 behavioral topics.
* Target: "Total Score" — a continuous weighted average (typically 2.5–4.0).
* The classifier buckets this score into 5 discrete performance bands.

Score bands (classifier output classes)
----------------------------------------
  Band 0  "Critical"        Total Score < 2.5
  Band 1  "At Risk"         2.5 ≤ Total Score < 3.0
  Band 2  "Average"         3.0 ≤ Total Score < 3.5
  Band 3  "Good"           3.5 ≤ Total Score < 4.0
  Band 4  "High Performer"  Total Score ≥ 4.0

Rules
-----
* NO dynamic answer generation.
* Every question topic and every score band has an explicit predefined response.
* Unknown bands fall back to FALLBACK_ANSWER.
"""

from __future__ import annotations


# ---------------------------------------------------------------------------
# Topic groups (for reference / display; not used in lookup)
# ---------------------------------------------------------------------------
QUESTION_TOPICS: dict[str, list[str]] = {
    "Sports & Physical Activity": [
        "Sports is equally important as academic subjects",
        "Sports should be a part of evaluation of grades in your academic result",
        "You feel that if your favorite game is part of exam then you will top this exam",
        "You can play your favorite sports without any time bound",
        "You cannot assume your life without sports",
        "Do you plan to continue participating in sports activities in the future",
        "Have you ever received encouragement or support from your peers or instructors to participate in sports activities",
        "How important do you think promoting sports culture is in educational institutions",
        "Rate your interest in participating in sports activities",
        "How often do you engage in sports activities",
    ],
    "Academic Engagement & Engineering Interest": [
        "Your parents forcefully admitted you in the engineering",
        "You dont know why you are studying all these things and didn't enjoy",
        "You want to get a job so that you can go in some another interest course",
        "This course is your favorite",
        "You see your career in this field only",
        "The resources (labs, equipment, software) required for your engineering studies are easily accessible",
        "How often do you collaborate with peers on engineering projects or studies",
        "Your instructors are supportive in guiding and encouraging your interest in engineering",
        "You plan to pursue a career in engineering after graduation",
        "You feel confident in identifying engineering problems and developing effective solutions",
    ],
    "Study Habits & Academic Motivation": [
        "You want to study but you don't know where to start",
        "You don't get interest in study because you think that whenever new semester will start then only you will study",
        "You feel that other students are very intelligent",
        "In a semester so many times you make your schedule of study",
        "After each semester you feel very guilty that you didn't gave your 100%",
        "Study is your first priority in exams",
        "If you get less score in exams, your friends are the main reason of your less score",
        "Your daily routine is not fix",
    ],
    "Self-Confidence & Personal Goals": [
        "You are confident in setting and achieving your personal and academic goals",
        "You are confident in social interactions with peers and instructors",
        "Rate your agreement with the statement: I have high self-esteem",
        "You have some past experiences (failures or successes) that influenced your current level of self-confidence",
        "You are comfortable with trying new activities or taking on new challenges",
    ],
    "Friendship & Peer Influence": [
        "You believe in friendship very much",
        "Your friends are same as you in each manner either in study or other things",
        "Your most of the time is spend with your friends",
        "You want to spend your time with your friends only in vacations also",
        "My friends have a positive influence on my academic and personal life",
        "How often do your friends distract you from your studies",
        "You feel pressured by your friends to engage in activities that you are uncomfortable with",
        "The approval of your friends is important in your decision-making process",
        "Do you participate in risky behaviors due to influence from friends",
        "You feel your friends impact your mental health",
    ],
    "Health & Well-being": [
        "Rate your agreement with the statement: I am generally in good health",
        "How does the quality and variety of food available to you impact your overall well-being in college",
        "How often do you eat meals in the campus dining halls or other food facilities",
        "How often do you engage in physical activity or exercise",
        "How would you rate your overall physical and mental health",
        "Do you experience health-related issues that affect your daily activities",
        "Do health issues affect your academic performance",
        "Do you feel supported by friends, family, and instructors when dealing with health issues",
        "You never like mess food",
        "All the time you feel very tired and lazy",
        "This environment doesn't suit you",
        "At home you are very energetic but not in college",
        "You don't get good sleep",
    ],
    "Family Pressure": [
        "Your parents always want you to improve more and never satisfies with your performance",
        "How satisfied are you with the resources available on campus for managing and coping with family pressure",
        "How does Family stress or difficulty impact your academic performance and well-being",
        "Your parents never motivate you like other parents",
        "Have you ever discussed this pressure with your family or anyone else for support",
        "You never achieve the expectations of your parents",
        "You don't want to talk your parents",
        "You think that your parents don't support you like other parents do",
        "Do you feel your parents' aspirations influence your own life goals and ambitions",
        "I feel pressure from my family to meet certain expectations",
    ],
    "Bad Habits & Addiction": [
        "Rate your agreement with the statement: I frequently engage in activities that I consider to be bad habits",
        "How effective have interventions (counseling, support groups, therapy) been in helping you manage or quit your bad habits",
        "You enjoy the late-night parties with your friends",
        "How do you feel about the resources available on campus for addressing bad habits or addiction",
        "How has your academic performance been impacted by any bad habits or addiction",
    ],
    "Homesickness": [
        "Rate your agreement with the statement: I frequently feel homesick",
        "You visit home as often as you can",
        "How satisfied are you with the resources available on campus for addressing homesickness",
        "How often do you stay in touch with family and friends from home",
        "You hardly ever think about home",
        "You call your family so many times during a day",
        "You hate this place",
        "You are very excited when vacation is there",
        "How significantly does homesickness affect your mental health",
        "How actively do you participate in campus activities to feel more connected",
    ],
    "Social Media & Mobile Addiction": [
        "You spend so much time on your mobile",
        "Your academic performance has been impacted by any Social media addiction",
        "Without any message also you scroll down the screen of your mobile for social media",
        "You cannot assume your life without social media sites or apps",
        "Your friends comment on your photo or story matter for you a lot",
        "You share every happy and sad moment with your friends by posting",
        "How significantly does your use of mobile phones or social media affect your physical health",
        "My use of mobile phones or social media disrupts my daily life and activities",
        "How often does your use of mobile phones or social media negatively impact your academic performance",
        "How significantly does your use of mobile phones or social media affect your productivity",
        "Have you ever tried to reduce your use of mobile phones or social media",
        "How anxious do you feel when you are unable to access your mobile phone or social media",
        "How often do you use your mobile phone or social media during classes or study sessions",
    ],
    "Mental Health & Wellbeing Indicators": [
        "Are you sleeping more or less than you normally sleep",
        "Do you feel tired, no matter how much you sleep",
        "Are you enjoying the things right now happening in your life",
        "You don't like interaction with anybody",
        "Have you noticed any changes in your physical appearance in the past month",
        "It is difficult for you to talk with your friends also",
        "Have you noticed any changes in your sleeping patterns or appetite recently",
        "Have you noticed any changes in your academic performance or behavior in the past month",
        "How often have you felt disoriented or confused in the past month",
    ],
}


# ---------------------------------------------------------------------------
# Fallback
# ---------------------------------------------------------------------------
FALLBACK_ANSWER: str = (
    "Your survey score could not be matched to a specific band. "
    "Please speak with a student counsellor for personalised support and guidance."
)


# ---------------------------------------------------------------------------
# Score-band → Predefined Answer mapping
# Five bands derived from the Total Score (continuous 1–5 weighted average)
# ---------------------------------------------------------------------------
SURVEY_ANSWER_MAP: dict[str, str] = {

    # ------------------------------------------------------------------
    # Band 4 — High Performer (Total Score ≥ 4.0)
    # ------------------------------------------------------------------
    "High Performer": (
        "🟢 Excellent! Your overall score reflects a high-performing, well-balanced student. "
        "You demonstrate strong academic engagement, positive peer relationships, good health habits, "
        "and a resilient mindset. You are managing pressure from family and the environment effectively, "
        "and your self-confidence levels are commendable. "
        "Continue building on your strengths: maintain a consistent daily routine, pursue leadership roles "
        "in clubs or hackathons, and consider mentoring peers who may be facing challenges you have overcome. "
        "Your trajectory is very promising — stay focused and keep nurturing your physical and mental well-being."
    ),

    # ------------------------------------------------------------------
    # Band 3 — Good (3.5 ≤ Total Score < 4.0)
    # ------------------------------------------------------------------
    "Good": (
        "🟡 Great work! Your survey score indicates you are performing well across most dimensions. "
        "You show good academic motivation, generally healthy friendships, and reasonable stress management. "
        "Some areas — such as study consistency, peer pressure, or screen-time habits — may still have "
        "room for improvement. "
        "Focus on locking in a fixed daily study schedule and limiting social media usage during study hours. "
        "If homesickness or family expectations occasionally weigh on you, consider speaking with a peer mentor "
        "or counsellor. Small, deliberate improvements in these areas can elevate your performance significantly."
    ),

    # ------------------------------------------------------------------
    # Band 2 — Average (3.0 ≤ Total Score < 3.5)
    # ------------------------------------------------------------------
    "Average": (
        "🟠 Your survey score places you in the average range. "
        "While you are managing your academic and personal life at a functional level, several behavioral "
        "patterns may be holding you back — such as irregular study routines, heavy reliance on social media, "
        "difficulty balancing friendships with academic responsibilities, or mild health and sleep issues. "
        "Action steps: \n"
        "  1. Fix a non-negotiable study block every day (e.g., 6 PM–9 PM). \n"
        "  2. Set a daily screen-time limit of 60 minutes on social media apps. \n"
        "  3. Talk to at least one instructor or mentor this week about your academic goals. \n"
        "  4. Make sure you are getting 7–8 hours of sleep each night. \n"
        "Consistent effort in these areas over 4–6 weeks will produce measurable improvement."
    ),

    # ------------------------------------------------------------------
    # Band 1 — At Risk (2.5 ≤ Total Score < 3.0)
    # ------------------------------------------------------------------
    "At Risk": (
        "🔴 Your survey score suggests you may be at risk of academic and personal difficulty. "
        "Multiple stress factors appear to be present at the same time — this could include poor sleep, "
        "heavy peer influence, family pressure, homesickness, lack of academic motivation, or reliance on "
        "unhealthy habits. "
        "This is not a failure — it is a signal that you need and deserve additional support right now. "
        "Immediate recommended steps: \n"
        "  1. Visit the campus counselling centre or student well-being office this week. \n"
        "  2. Have an honest conversation with one trusted friend, family member, or instructor. \n"
        "  3. Reduce late-night social activities and re-establish a sleep routine. \n"
        "  4. Break your academic backlog into tiny daily tasks — do not try to catch up all at once. \n"
        "  5. Engage in at least 20 minutes of physical activity daily — even a short walk helps significantly. \n"
        "Remember: reaching out is a sign of strength, not weakness. Help is available and you can turn this around."
    ),

    # ------------------------------------------------------------------
    # Band 0 — Critical (Total Score < 2.5)
    # ------------------------------------------------------------------
    "Critical": (
        "🚨 Your survey score indicates a critical level of distress across multiple areas of your life. "
        "You may be experiencing severe academic disengagement, significant mental health strain, very poor "
        "sleep, intense family or peer pressure, and a sense of being completely overwhelmed. "
        "Please know that this situation is temporary and help is available. "
        "Urgent action steps: \n"
        "  1. Do NOT delay — contact your campus counsellor, mental health helpline, or trusted adult TODAY. \n"
        "  2. If you feel hopeless or are having thoughts of harming yourself, call a crisis helpline immediately. \n"
        "     (India: iCall – 9152987821 | Vandrevala Foundation – 1860-2662-345) \n"
        "  3. Take a break from social media entirely for at least one week. \n"
        "  4. Tell one person — a friend, parent, or instructor — exactly how you are feeling. \n"
        "  5. Do not make major life decisions while in this state. Focus only on the next 24 hours. \n"
        "You are not alone. Many students have been in this exact place and have recovered fully with the right support."
    ),
}


# ---------------------------------------------------------------------------
# Score-band boundary function
# ---------------------------------------------------------------------------
def score_to_band(total_score: float) -> str:
    """
    Convert a numeric Total Score into a band label.

    Parameters
    ----------
    total_score : float
        The weighted average Total Score from the survey (typically 1.0–5.0).

    Returns
    -------
    str
        One of: 'High Performer', 'Good', 'Average', 'At Risk', 'Critical'
    """
    if total_score >= 4.0:
        return "High Performer"
    elif total_score >= 3.5:
        return "Good"
    elif total_score >= 3.0:
        return "Average"
    elif total_score >= 2.5:
        return "At Risk"
    else:
        return "Critical"


# ---------------------------------------------------------------------------
# Public interface
# ---------------------------------------------------------------------------

def get_survey_answer(total_score: float) -> dict[str, str]:
    """
    Return the predefined answer for a given Total Score.

    Parameters
    ----------
    total_score : float
        The Total Score column value from synthetic_student_data.csv

    Returns
    -------
    dict with keys:
        - band   : str  — the classified performance band
        - answer : str  — the predefined human-readable answer
    """
    band = score_to_band(total_score)
    return {
        "band": band,
        "answer": SURVEY_ANSWER_MAP.get(band, FALLBACK_ANSWER),
    }


def get_topic_questions(topic: str) -> list[str]:
    """Return all questions belonging to a given topic group."""
    return QUESTION_TOPICS.get(topic, [])


def list_topics() -> list[str]:
    """Return all question topic group names."""
    return list(QUESTION_TOPICS.keys())


def list_bands() -> list[str]:
    """Return all band labels in order from lowest to highest."""
    return ["Critical", "At Risk", "Average", "Good", "High Performer"]
