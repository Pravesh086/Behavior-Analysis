"""
individual_question_answers.py
================================
Predefined answer for EVERY individual question in synthetic_student_data.csv.

Structure
---------
QUESTION_ANSWERS : dict[str, dict]
    key   → clean question text (column name without the rating suffix)
    value → {
        "category" : str   — topic group
        "answer"   : str   — predefined guidance answer
    }

Usage
-----
    from ml_project.src.individual_question_answers import get_answer, CATEGORIES

    ans = get_answer("Sports is equally important as academic subjects")
    print(ans["category"])   # "Sports & Physical Activity"
    print(ans["answer"])     # full answer text
"""

from __future__ import annotations

FALLBACK_ANSWER = (
    "This question explores an important aspect of your academic and personal life. "
    "Please speak with a student counsellor or mentor for personalised guidance on this topic."
)

# ---------------------------------------------------------------------------
# Master mapping  —  105 questions
# ---------------------------------------------------------------------------
QUESTION_ANSWERS: dict[str, dict] = {

    # ======================================================================
    # CATEGORY 1 : Sports & Physical Activity  (Q1–Q10)
    # ======================================================================

    "Sports is equally important as academic subjects": {
        "category": "Sports & Physical Activity",
        "answer": (
            "Sports develop discipline, teamwork, and resilience — qualities just as essential "
            "to your success as textbook knowledge. Research consistently shows that students "
            "who stay physically active perform better academically because exercise improves "
            "memory, focus, and mood. Make time for at least one physical activity per week "
            "alongside your studies. Balance, not exclusion, is the key."
        ),
    },

    "Sports should be a part of evaluation of grades in your academic result": {
        "category": "Sports & Physical Activity",
        "answer": (
            "Including sports in academic evaluation recognises the holistic development of "
            "students. Physical aptitude, teamwork, and sportsmanship are real, measurable "
            "skills. If you believe your institution should adopt this approach, engage with "
            "student councils or faculty boards to advocate for it. Many universities globally "
            "have already integrated co-curricular achievements into records."
        ),
    },

    "You feel that if your favorite game is part of exam then you will top this exam": {
        "category": "Sports & Physical Activity",
        "answer": (
            "This reflects powerful intrinsic motivation and passion. Channel that same energy "
            "into your academic subjects by finding what genuinely interests you within each "
            "course. When you link learning to things you love, performance improves naturally. "
            "Try turning a boring lecture topic into a challenge or a game to ignite the same "
            "competitive drive you feel in sports."
        ),
    },

    "You can play your favorite sports without any time bound": {
        "category": "Sports & Physical Activity",
        "answer": (
            "The freedom to pursue sports without restriction is a wonderful privilege that "
            "supports mental well-being. If you feel constrained by schedules, negotiate "
            "structured sports slots with your institute or hostel. Even 30 minutes of sport "
            "daily transforms mood, focus, and stress levels. Guard this time — physical "
            "activity is not a luxury, it is a necessity."
        ),
    },

    "You cannot assume your life without sports": {
        "category": "Sports & Physical Activity",
        "answer": (
            "Your deep connection to sports is a genuine strength. It means you have a "
            "consistent, renewable source of joy and energy. Make sure this passion coexists "
            "with your academic commitments through a clear weekly schedule. Many successful "
            "professionals maintain an active sporting life throughout their careers — "
            "your love for sport is an asset, not an obstacle."
        ),
    },

    "Do you plan to continue participating in sports activities in the future": {
        "category": "Sports & Physical Activity",
        "answer": (
            "Continuing sports beyond college is one of the best investments in your long-term "
            "well-being. Physical activity reduces the risk of depression, anxiety, and chronic "
            "disease by significant margins. Whether recreational or competitive, plan early — "
            "join a local club, register for community leagues, or build a daily exercise habit "
            "before graduation so it carries naturally into your professional life."
        ),
    },

    "Have you ever received encouragement or support from your peers or instructors to participate in sports activities": {
        "category": "Sports & Physical Activity",
        "answer": (
            "Encouragement from your environment fuels persistence. If you haven't received "
            "enough support for your sporting interests, actively seek it — join campus sports "
            "clubs, connect with a college coach, or find peers who share your sport. "
            "Creating your own support network is just as valid as receiving institutional "
            "encouragement. Your enthusiasm is the best recruiting tool."
        ),
    },

    "How important do you think promoting sports culture is in educational institutions": {
        "category": "Sports & Physical Activity",
        "answer": (
            "A strong sports culture in educational institutions produces healthier, happier, "
            "and more resilient students. Stress levels fall, teamwork improves, and student "
            "engagement rises when physical activity is celebrated. If your campus lacks this "
            "culture, you can be the change — organise a tournament, start a club, or petition "
            "for better sports facilities. Student-led initiatives are often the most effective."
        ),
    },

    "Rate your interest in participating in sports activities": {
        "category": "Sports & Physical Activity",
        "answer": (
            "Your level of sports interest is a strong predictor of your physical and mental "
            "health trajectory. If your interest is low, explore different activities until "
            "you find one that feels enjoyable rather than obligatory. Yoga, cycling, "
            "badminton, swimming, or even brisk walking count. The best exercise is simply "
            "one you will actually do consistently."
        ),
    },

    "How often do you engage in sports activities": {
        "category": "Sports & Physical Activity",
        "answer": (
            "Regular physical activity — even three 30-minute sessions per week — significantly "
            "improves academic performance, working memory, and emotional regulation. If you "
            "are not currently active, start with a 10-minute daily walk and scale up weekly. "
            "Consistency matters far more than intensity when building a lasting habit."
        ),
    },

    # ======================================================================
    # CATEGORY 2 : Academic Engagement & Engineering Interest  (Q11–Q20)
    # ======================================================================

    "Your parents forcefully admitted you in the engineering": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Feeling that your academic path was not your own choice is a real and valid "
            "challenge. Acknowledge those feelings without guilt, then speak with a counsellor "
            "or academic advisor about your options — whether that means finding your own "
            "motivation within engineering, exploring a branch transfer, or understanding "
            "the full picture of where this degree can take you on terms that feel like yours."
        ),
    },

    "You dont know why you are studying all these things and didn't enjoy": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Lack of purpose in studies is very common among engineering students, especially "
            "in the first two years. Connect each subject to real-world problems you care about. "
            "Attend industry events, watch documentary content about engineering innovations, "
            "and experiment with small personal projects. Purpose rarely arrives on its own — "
            "it has to be actively searched for and constructed."
        ),
    },

    "You want to get a job so that you can go in some another interest course": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Planning a career pivot after graduation is more common than you think, and "
            "perfectly valid. Many successful people use their undergraduate degree as a "
            "launchpad into a completely different field. In the meantime, complete your "
            "degree with enough quality to keep doors open, and use free time now to explore "
            "your true interest through online courses, internships, or side projects."
        ),
    },

    "This course is your favorite": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "When your field of study is also your passion, you hold a natural advantage that "
            "most students envy. Deepen your expertise through research projects, national "
            "competitions, and summer internships. Passion-driven students consistently "
            "outperform their peers over the long arc of their careers. Protect and nurture "
            "this enthusiasm — it is your greatest academic asset."
        ),
    },

    "You see your career in this field only": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Having a clear, singular career vision is a tremendous motivator. Build a concrete "
            "roadmap: identify the specific role you want five years from now, list the skills "
            "and certifications required, and map exactly which semesters you will acquire them. "
            "Review and update this roadmap at the start of every semester to stay on track."
        ),
    },

    "The resources (labs, equipment, software) required for your engineering studies are easily accessible": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Access to quality learning resources directly determines the depth of your "
            "practical understanding. If campus resources feel insufficient, proactively seek "
            "alternatives: online simulators and virtual labs, open-source software tools, "
            "library subscriptions, or peer collaboration with students who have access. "
            "Filing a formal request through student representatives can also drive institutional improvement."
        ),
    },

    "How often do you collaborate with peers on engineering projects or studies": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Collaboration is one of the most powerful learning accelerators available to you. "
            "Working with peers exposes you to different problem-solving approaches, builds "
            "communication skills, and closely mirrors real-world engineering teams. "
            "Aim for at least one meaningful collaborative project each semester — "
            "study groups, hackathons, and open-source contributions all qualify."
        ),
    },

    "Your instructors are supportive in guiding and encouraging your interest in engineering": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Supportive instructors can completely transform your academic journey. If you "
            "feel unsupported, be proactive — visit office hours, send specific questions by "
            "email, and attend department seminars. Seek out a mentor outside your immediate "
            "department or through professional societies like IEEE or ISTE who shares your "
            "specific engineering interests."
        ),
    },

    "You plan to pursue a career in engineering after graduation": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Clear career intent is a significant advantage — students who know what they want "
            "make better use of every semester. Begin building toward it now: secure at least "
            "one internship, build a portfolio of projects, earn one relevant certification, "
            "and network actively with professionals in your chosen engineering domain. "
            "Every semester is an opportunity to close the gap between where you are "
            "and where you want to be."
        ),
    },

    "You feel confident in identifying engineering problems and developing effective solutions": {
        "category": "Academic Engagement & Engineering Interest",
        "answer": (
            "Problem-solving confidence is the core competency of engineering. If this "
            "confidence is low, practice deliberately and consistently — solve one new "
            "technical problem each day, participate in hackathons, and discuss your "
            "solutions with peers to sharpen your analytical thinking. Confidence in "
            "problem-solving is built through repetition, not inspiration."
        ),
    },

    # ======================================================================
    # CATEGORY 3 : Study Habits & Academic Motivation  (Q21–Q25, Q71–Q73)
    # ======================================================================

    "You want to study but you don't know where to start": {
        "category": "Study Habits & Academic Motivation",
        "answer": (
            "Start anywhere — but start now. Break your syllabus into a visual mind map, "
            "pick the easiest topic available, and study it for just 25 minutes using the "
            "Pomodoro technique. The paralysis of 'not knowing where to start' dissolves the "
            "moment you take the first small action. Progress, however small, generates "
            "its own momentum."
        ),
    },

    "You don't get interest in study because you think that whenever new semester will start then only you will study": {
        "category": "Study Habits & Academic Motivation",
        "answer": (
            "The 'fresh start' trap is one of the most destructive academic patterns. "
            "Every new day is a fresh start — not just every new semester. Begin today with "
            "just 15 minutes of review of the most recent lecture. Small daily efforts "
            "compound dramatically over a semester in a way that last-minute cramming never "
            "can. Break the cycle today, not next semester."
        ),
    },

    "You feel that other students are very intelligent": {
        "category": "Study Habits & Academic Motivation",
        "answer": (
            "Comparing yourself to peers is a trap that quietly destroys motivation. "
            "Every student has a different background, learning pace, and set of strengths. "
            "The student who appears most confident often works the hardest behind the scenes. "
            "Focus exclusively on YOUR own progress — compare yourself only to who you were "
            "last week, not to anyone else in the room."
        ),
    },

    "In a semester so many times you make your schedule of study": {
        "category": "Study Habits & Academic Motivation",
        "answer": (
            "Repeated schedule-making without follow-through is a well-documented form of "
            "productive procrastination. Planning feels like progress but is not the same thing. "
            "Make one simple schedule — just two subjects per day — and commit to it for five "
            "consecutive days before revising anything. Consistency with an imperfect schedule "
            "will always outperform perfection that never begins."
        ),
    },

    "After each semester you feel very guilty that you didn't gave your 100%": {
        "category": "Study Habits & Academic Motivation",
        "answer": (
            "Post-semester guilt is useful only if it is converted into a specific action plan. "
            "After your next exam season, spend 30 minutes writing: what specifically went "
            "wrong, what behavior change would have made the biggest difference, and three "
            "concrete actions you will take from Day 1 of the next semester. "
            "Guilt without analysis changes nothing. Guilt with a plan changes everything."
        ),
    },

    "Study is your first priority in exams": {
        "category": "Study Habits & Academic Motivation",
        "answer": (
            "Making study your genuine first priority during exams is the single most impactful "
            "decision you can make. Block out your exam calendar 2–3 weeks in advance, "
            "prioritize topics by their examination weight, and schedule daily, timed review "
            "sessions for each subject. Combine this with adequate sleep and you will see "
            "significantly better outcomes than late-night cramming."
        ),
    },

    "If you get less score in exams, your friends are the main reason of your less score": {
        "category": "Study Habits & Academic Motivation",
        "answer": (
            "Blaming friends for poor exam results is a cognitive pattern that prevents you "
            "from identifying and fixing the real cause. Analyze your last exam specifically: "
            "which topics did you miss? What study strategies failed? Were boundaries set "
            "during critical study periods? Taking ownership of outcomes is not self-blame — "
            "it is the only way to actually improve performance next time."
        ),
    },

    "Your daily routine is not fix": {
        "category": "Study Habits & Academic Motivation",
        "answer": (
            "An inconsistent daily routine is among the biggest structural barriers to "
            "academic progress. You do not need a rigid hour-by-hour timetable. Even a "
            "simple three-anchor routine — wake time, study start time, and sleep time — "
            "provides enough structure to dramatically improve productivity. "
            "Start by fixing just one anchor (your wake time) and build from there."
        ),
    },

    # ======================================================================
    # CATEGORY 4 : Self-Confidence & Personal Goals  (Q26–Q30)
    # ======================================================================

    "You are confident in setting and achieving your personal and academic goals": {
        "category": "Self-Confidence & Personal Goals",
        "answer": (
            "Goal-setting confidence is a skill that grows directly with practice. Write down "
            "one specific, measurable goal for this week — not this year, just this week. "
            "When you achieve it, your brain builds the neurological foundation for larger "
            "goals. Start deliberately small and scale up. Confidence is not a feeling "
            "you wait for; it is a result you create through consistent action."
        ),
    },

    "You are  confident in social interactions with peers and instructors": {
        "category": "Self-Confidence & Personal Goals",
        "answer": (
            "Social confidence is a skill, not an innate trait — it improves with consistent, "
            "deliberate practice. Challenge yourself to initiate one conversation with a "
            "classmate or instructor each day this week. Ask a question in class that you "
            "already know the answer to, just to practice speaking up. "
            "Each small interaction builds your comfort level and capability measurably."
        ),
    },

    "Rate your agreement with the statement: I have high self-esteem": {
        "category": "Self-Confidence & Personal Goals",
        "answer": (
            "Healthy self-esteem is built through consistent action aligned with your own "
            "values — not through external validation or social media metrics. "
            "Focus on doing things you are genuinely proud of: keeping promises to yourself, "
            "helping a peer, learning something new each week. Low self-esteem responds well "
            "to therapy and structured self-compassion practices. A counsellor can help you "
            "build this foundation sustainably."
        ),
    },

    "You have some past experiences (failures or successes) that influenced your current level of self-confidence": {
        "category": "Self-Confidence & Personal Goals",
        "answer": (
            "Every experience — failure or success — is data, not destiny. Failures show you "
            "what to adjust; successes show you what to repeat. Reflect on your three biggest "
            "past experiences and write one specific lesson from each. Apply those lessons "
            "deliberately going forward. Your past does not define your future capability, "
            "but it absolutely informs your strategy for it."
        ),
    },

    "You are comfortable with trying new activities or taking on new challenges": {
        "category": "Self-Confidence & Personal Goals",
        "answer": (
            "Comfort with novelty and challenge is one of the strongest predictors of "
            "long-term growth and career resilience. If new things feel uncomfortable, "
            "start with tiny, low-stakes experiments — attend one new event, try one "
            "new study technique, speak to one new person each week. "
            "The discomfort of growth is temporary; the cost of stagnation is permanent."
        ),
    },

    # ======================================================================
    # CATEGORY 5 : Friendship & Peer Influence  (Q31–Q40)
    # ======================================================================

    "You believe in friendship very much": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "Deep belief in friendship is a beautiful quality that contributes enormously "
            "to mental health and well-being. Ensure your friendships are genuinely reciprocal, "
            "honest, and growth-oriented. The best friendships challenge you to be better, "
            "not just comfortable. Regularly reflect on whether your closest friendships "
            "are aligned with who you want to become."
        ),
    },

    "Your friends are same as you in each manner either in study or other things": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "Surrounding yourself with highly similar people feels comfortable but can "
            "limit your intellectual and personal growth. Seek out at least a few friends "
            "with different strengths, backgrounds, and perspectives. Their viewpoints "
            "will challenge, expand, and sharpen your thinking in ways that a homogeneous "
            "friend group simply cannot."
        ),
    },

    "Your most of the time is spend with your friends": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "The people you spend the most time with shape your habits, mindset, and "
            "ambitions more profoundly than almost any other factor. Assess honestly: "
            "is your circle pulling you toward your goals or away from them? "
            "Quality time with the right people is far more beneficial than large "
            "quantities of time with the wrong ones. Choose your immediate environment "
            "with the same care you choose your career."
        ),
    },

    "You want to spend your time with your friends only in vacations also": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "Healthy social connections during vacations actively recharge your mental "
            "energy for the semester ahead. Balance this with some individual time for "
            "personal reflection, rest, and skill development. Vacations are also an "
            "excellent time to pursue a project, read books, or explore interests that "
            "the semester's pace doesn't allow."
        ),
    },

    "Rate your agreement with the statement: My friends have a positive influence on my academic and personal life": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "Positive peer influence is one of the strongest and most consistent predictors "
            "of student academic success. If your friends uplift, motivate, and challenge "
            "you, actively nurture those friendships — study together, celebrate each other's "
            "milestones, and hold each other accountable. If they don't, it is worth "
            "thoughtfully reconsidering how much time and energy you invest."
        ),
    },

    "How often do your friends distract you from your studies": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "Frequent study distraction from friends is a significant, documentable academic "
            "risk. Set clear, communicated study boundaries: share your study schedule with "
            "friends and ask them to respect those blocks. Use study spaces away from social "
            "areas. True friends will support your commitment — those who don't are worth "
            "evaluating as friends."
        ),
    },

    "You feel pressured by your friends to engage in activities that you are uncomfortable with": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "Peer pressure that conflicts with your values is a serious concern that should "
            "not be minimized. Develop the quiet confidence to say 'I'm not comfortable "
            "with that' — clearly, calmly, and without lengthy justification. "
            "Friends who genuinely respect you will accept your boundary. "
            "Those who don't are demonstrating something important about the nature of that friendship."
        ),
    },

    "The approval of your friends is important   in your decision-making process": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "While belonging matters, making major decisions primarily based on peer approval "
            "quietly redirects your life away from your own deepest goals and values. "
            "Practice making one small daily decision entirely on your own — what to study, "
            "what to eat, what to watch — based purely on your own judgment. "
            "This builds the muscle of independent decision-making over time."
        ),
    },

    "Do you participate in risky behaviors due to influence from friends": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "Participating in risky behaviors — substance use, dangerous activities, academic "
            "dishonesty — due to peer influence can have consequences that outlast college "
            "permanently. If you feel pressured, speak to a campus counsellor confidentially "
            "and urgently. You have the right to protect your future regardless of what your "
            "immediate peer group normalizes. Your long-term self deserves that protection."
        ),
    },

    "You feel your friends impact your mental health": {
        "category": "Friendship & Peer Influence",
        "answer": (
            "Friend groups that consistently drain or destabilize your mental health require "
            "honest evaluation. You have every right to set limits on relationships that harm "
            "your well-being, even when those relationships are long-standing. "
            "Gradually strengthen connections that energize you and reduce time with those "
            "that consistently exhaust or diminish you. This is self-care, not selfishness."
        ),
    },

    # ======================================================================
    # CATEGORY 6 : Health & Well-being  (Q41–Q53)
    # ======================================================================

    "Rate your agreement with the statement: I am generally in good health": {
        "category": "Health & Well-being",
        "answer": (
            "Good health is your most foundational academic asset — without it, everything "
            "else suffers. Maintain it actively with consistent sleep (7–8 hours), nutritious "
            "meals, daily hydration, and regular movement. If your self-rated health is poor, "
            "treat it as the urgent signal it is: schedule a doctor's visit and speak with "
            "a counsellor this week."
        ),
    },

    "How does the quality and variety of food available to you impact your overall well-being in college": {
        "category": "Health & Well-being",
        "answer": (
            "Nutrition directly and measurably affects brain function, energy, mood, and "
            "immune system strength. Even in a hostel or on a tight budget, prioritise "
            "protein, vegetables, and fruits wherever possible. Avoid relying exclusively "
            "on fried, processed, or high-sugar foods, which impair the sustained cognitive "
            "performance your studies require."
        ),
    },

    "How often do you eat meals in the campus dining halls or other food facilities": {
        "category": "Health & Well-being",
        "answer": (
            "Regular, structured meals maintain stable blood sugar and energy throughout the "
            "day — both essential for consistent academic focus. Skipping meals, particularly "
            "breakfast, significantly impairs morning concentration and decision-making. "
            "Even a small, nutritious breakfast takes five minutes and makes a measurable "
            "difference to your morning performance."
        ),
    },

    "How often do you engage in physical activity or exercise": {
        "category": "Health & Well-being",
        "answer": (
            "Physical activity is as important as studying for your academic performance. "
            "Even 20–30 minutes of daily movement — walking, cycling, yoga, badminton — "
            "boosts working memory, focus, and emotional regulation. If you are not "
            "currently active, start with a 10-minute daily walk and increase by five "
            "minutes each week. The barrier to starting is far smaller than the benefit."
        ),
    },

    "How would you rate your overall physical and mental health": {
        "category": "Health & Well-being",
        "answer": (
            "Your self-rated health is one of the strongest predictors of actual health "
            "outcomes documented in research. If you rate either your physical or mental "
            "health as poor or very poor, this is a critical signal demanding action — "
            "not patience. See a campus doctor and a counsellor within the next two weeks. "
            "Early intervention prevents minor health issues from becoming major ones."
        ),
    },

    "Do you experience health-related issues that affect your daily activities": {
        "category": "Health & Well-being",
        "answer": (
            "Recurring health issues that interfere with daily activities should never be "
            "normalized or ignored. Visit a campus health center or external doctor promptly. "
            "Inform your academic department so they can activate appropriate support mechanisms. "
            "Untreated health problems consistently worsen over time and compound "
            "their impact on academic and personal life."
        ),
    },

    "Do health issues affect your academic performance": {
        "category": "Health & Well-being",
        "answer": (
            "When health affects academics, address the root cause rather than only managing "
            "the academic symptom. Inform your instructors and academic advisor about your "
            "health challenges — most institutions have medical leave policies, extended "
            "deadlines, and academic support specifically for students dealing with health issues. "
            "Asking for this support is your right, not a weakness."
        ),
    },

    "Do you feel supported by friends, family, and instructors when dealing with health issues": {
        "category": "Health & Well-being",
        "answer": (
            "Feeling unsupported during health challenges amplifies stress significantly and "
            "slows recovery. If your natural support network is insufficient, proactively "
            "access campus health services, student counselling, and peer support groups. "
            "Online communities for students managing specific health conditions can also "
            "provide valuable connection. You do not have to manage this alone."
        ),
    },

    "You never like mess food": {
        "category": "Health & Well-being",
        "answer": (
            "Disliking hostel mess food is extremely common and completely valid. "
            "Supplement mess meals with healthy snacks — fruits, nuts, boiled eggs, "
            "sprouts — which are affordable and easy to keep in your room. "
            "Cooking simple meals occasionally (where facilities allow) can improve "
            "both nutrition and your sense of control over your environment."
        ),
    },

    "All the time you feel very tired and lazy": {
        "category": "Health & Well-being",
        "answer": (
            "Persistent fatigue and low motivation that do not resolve with rest can indicate "
            "poor sleep quality, nutritional deficiency (especially iron or vitamin D), "
            "dehydration, thyroid issues, or depression. If this feeling is constant, "
            "do not dismiss it as laziness — visit a doctor for a basic blood panel "
            "and speak with a counsellor about your mental state."
        ),
    },

    "This environment doesn't suit you": {
        "category": "Health & Well-being",
        "answer": (
            "Environmental discomfort — noise, climate, culture, crowding — is real and "
            "measurably affects academic performance and well-being. Identify specifically "
            "what bothers you most and address that element: noise-cancelling headphones, "
            "rearranging your study space, discovering quiet library corners, or connecting "
            "more deliberately with peers from similar backgrounds. Environments can be redesigned."
        ),
    },

    "At home you are very energetic but not in college": {
        "category": "Health & Well-being",
        "answer": (
            "A significant energy gap between home and college usually points to homesickness, "
            "social isolation, unmet needs, or an environment that does not feel safe or "
            "comfortable. Consider what specific element home provides — family, familiarity, "
            "food, routine, nature — and actively work to recreate at least one of these "
            "elements within your college environment."
        ),
    },

    "You don't get good sleep": {
        "category": "Health & Well-being",
        "answer": (
            "Poor sleep is among the most significant and underestimated academic performance "
            "killers among college students. Establish a fixed sleep schedule (same bedtime "
            "and wake time every day, including weekends), eliminate all screens 30 minutes "
            "before bed, keep your room dark and cool, and avoid caffeine after 4 PM. "
            "Seven to eight hours of quality sleep is not optional for optimal brain function."
        ),
    },

    # ======================================================================
    # CATEGORY 7 : Family Pressure  (Q54–Q63)
    # ======================================================================

    "Your parents always want you to improve more and never satisfies with your performance": {
        "category": "Family Pressure",
        "answer": (
            "Parents who continuously push for more are often driven by love and high hopes, "
            "even when it feels relentless or unfair. Have a calm, honest conversation with "
            "them about the specific pressure you experience and how it makes you feel. "
            "Setting shared, agreed-upon expectations together can transform the relationship "
            "from a source of stress into a source of genuine support."
        ),
    },

    "How satisfied are you with the resources available on campus for managing and coping with family pressure": {
        "category": "Family Pressure",
        "answer": (
            "If campus resources for managing family pressure feel insufficient, explore "
            "alternatives actively: student counselling services, online therapy platforms, "
            "peer support groups, and student welfare organizations. Family pressure is one "
            "of the most common stressors reported by college students — you are not alone "
            "in this, and structured support is available beyond the campus."
        ),
    },

    "How does Family stress or difficulty impact your academic performance and well-being": {
        "category": "Family Pressure",
        "answer": (
            "Family stress directly impairs concentration, working memory, motivation, and "
            "sleep quality — all of which are essential for academic performance. "
            "Create a deliberate mental boundary between family time and study time. "
            "When studying, physically log out of family communication channels and focus "
            "fully for your scheduled block. Even 90 minutes of protected study with family "
            "devices away is more productive than four hours of distracted reviewing."
        ),
    },

    "Your parents never motivate you like other parents": {
        "category": "Family Pressure",
        "answer": (
            "Comparing parental support is a painful experience that deserves acknowledgment, "
            "not dismissal. If your home environment lacks encouragement, build your support "
            "network elsewhere — through faculty mentors, senior students who have navigated "
            "similar situations, or student organizations that actively celebrate growth and achievement. "
            "Motivation from external sources is powerful and genuinely available to you."
        ),
    },

    "Have you ever discussed this pressure with your family or anyone else for support": {
        "category": "Family Pressure",
        "answer": (
            "Opening up to family about academic and personal pressure can feel daunting, "
            "but it often leads to surprising revelations — many parents genuinely do not "
            "realize the weight their expectations carry day-to-day. A single honest, "
            "calm conversation can shift the entire dynamic. If direct conversation feels "
            "impossible, a counsellor can help you prepare and facilitate it."
        ),
    },

    "You never achieve the expectations of your parents": {
        "category": "Family Pressure",
        "answer": (
            "Perpetually feeling like you fall short of your parents' expectations is "
            "exhausting, demoralizing, and corrosive to self-worth. First, examine whether "
            "those expectations are actually realistic given your circumstances. Then have "
            "an honest negotiation about more grounded, achievable targets. "
            "Your mental health and sustainable progress are not worth sacrificing for "
            "standards that do not account for who you actually are."
        ),
    },

    "You don't want to talk your parents": {
        "category": "Family Pressure",
        "answer": (
            "Withdrawal from family communication often signals deeper stress, conflict, "
            "or emotional exhaustion that has quietly built up. If speaking feels too "
            "difficult right now, try writing a letter or message first — organizing "
            "your thoughts in writing before a conversation often makes that conversation "
            "far easier. A counsellor can also help you prepare for and navigate "
            "difficult family communication."
        ),
    },

    "You think that your parents don't support you like other parents do": {
        "category": "Family Pressure",
        "answer": (
            "Feeling unsupported by family is a real and valid pain that should not be "
            "minimized. Independently build your own support ecosystem: faculty mentors, "
            "senior students who have navigated similar family dynamics, alumni networks, "
            "and peer communities. You have the capacity to build a rich, nurturing "
            "support network that extends well beyond your family of origin."
        ),
    },

    "Do you feel your parents' aspirations influence your own life goals and ambitions": {
        "category": "Family Pressure",
        "answer": (
            "Parental aspirations are powerful and often invisible influencers of your "
            "goals. Periodically pause and ask yourself honestly: 'Is this my goal or "
            "my parents' goal?' Clarifying what YOU genuinely want — separate from "
            "inherited expectations — is essential for building authentic motivation "
            "that sustains you through difficulty. Genuine goals make setbacks feel "
            "temporary; borrowed goals make them feel pointless."
        ),
    },

    "Rate your agreement with the statement: I feel pressure from my family to meet certain expectations": {
        "category": "Family Pressure",
        "answer": (
            "Moderate family pressure can serve as a healthy motivator. Intense, persistent "
            "family pressure significantly increases anxiety, burnout risk, and the likelihood "
            "of academic withdrawal. Build practical strategies: regular journalling, daily "
            "physical activity, structured counselling, and clear communication boundaries "
            "with your family. All of these are evidence-based interventions for managing "
            "this specific form of chronic stress."
        ),
    },

    # ======================================================================
    # CATEGORY 8 : Bad Habits & Addiction  (Q64–Q70)
    # ======================================================================

    "Rate your agreement with the statement: I frequently engage in activities that I consider to be bad habits": {
        "category": "Bad Habits & Addiction",
        "answer": (
            "Awareness of your own bad habits is genuinely the first and most important "
            "step toward changing them — many people never get this far. Identify your "
            "top three habits you want to change, understand their specific triggers, "
            "and design one small replacement behavior for each. Change one habit at a time, "
            "not all at once. Progress compounds; attempting everything simultaneously usually produces nothing."
        ),
    },

    "How effective have interventions (counseling, support groups, therapy) been in helping you manage or quit your bad habits": {
        "category": "Bad Habits & Addiction",
        "answer": (
            "If past interventions have not produced lasting change, that is not a sign of "
            "personal failure — it is a sign that you need a different approach. "
            "Professional counselling (particularly CBT), structured support groups, "
            "and habit-replacement apps can provide the external structure that willpower "
            "alone reliably cannot sustain. Try a different modality rather than abandoning the effort."
        ),
    },

    "You don't get good sleep (bad habits context)": {
        "category": "Bad Habits & Addiction",
        "answer": (
            "When bad habits — late-night screen use, irregular eating, substances, "
            "late-night socializing — are the root cause of poor sleep, addressing "
            "the sleep symptom without changing the habit will not produce lasting results. "
            "Identify which specific behavior most directly triggers your poor sleep "
            "and focus exclusively on that one behavior first."
        ),
    },

    "You enjoy the late-night parties with your friends": {
        "category": "Bad Habits & Addiction",
        "answer": (
            "Occasional social events are a healthy, enjoyable part of college life. "
            "However, frequent late nights consistently and measurably damage sleep quality, "
            "next-day academic performance, and long-term physical health. "
            "Establish a personal guideline: social events on weekends only, with a firm "
            "weekday sleep schedule. Your future productivity depends on protecting "
            "your weekday nights."
        ),
    },

    "How do you feel about the resources available on campus for addressing bad habits or addiction": {
        "category": "Bad Habits & Addiction",
        "answer": (
            "If campus resources feel insufficient for addressing bad habits or addiction, "
            "explore alternatives actively: free CBT-based tools online, habit-tracking "
            "applications, anonymous student forums, and external counselling services. "
            "Seeking help for habits that are harming you is a demonstrable sign of "
            "maturity and self-awareness — not weakness. The sooner you address them, "
            "the smaller their long-term cost."
        ),
    },

    "How has your academic performance been impacted by any bad habits or addiction": {
        "category": "Bad Habits & Addiction",
        "answer": (
            "Bad habits quietly erode academic performance in ways that are often not "
            "fully visible until exam results arrive. Identify the single habit most "
            "directly impacting your grades and commit to a measurable 50% reduction "
            "over the next 30 days. Track the impact on your weekly academic output. "
            "The data will become its own motivation for continued reduction."
        ),
    },

    "How do you feel about the resources available on campus for addressing bad habits or addiction (2)": {
        "category": "Bad Habits & Addiction",
        "answer": (
            "Repeated awareness of insufficient institutional resources is valuable feedback. "
            "Document your experience and share it with the student welfare committee, "
            "student union, or campus counselling management. Student feedback is often "
            "the primary driver of improvement in campus well-being services. "
            "Meanwhile, external and online resources remain available immediately."
        ),
    },

    # ======================================================================
    # CATEGORY 9 : Homesickness  (Q74–Q83)
    # ======================================================================

    "Rate your agreement with the statement: I frequently feel homesick": {
        "category": "Homesickness",
        "answer": (
            "Homesickness is extremely common, especially in the first year — studies show "
            "that over 70% of first-year students experience it significantly. Build "
            "'home' into your college life: cook a familiar meal occasionally, video-call "
            "family at a fixed daily time, connect with peers from your hometown or "
            "cultural background, and create small rituals that feel like home. "
            "These micro-connections reduce the intensity of disconnection over time."
        ),
    },

    "You visit home as often as you can": {
        "category": "Homesickness",
        "answer": (
            "Regular home visits provide emotional restoration and are genuinely important. "
            "Balance them thoughtfully with active college engagement — when you are at "
            "college, be fully present in campus life, friendships, and activities. "
            "The goal is for college to gradually feel like a second home, which happens "
            "through consistent engagement rather than frequent escapes."
        ),
    },

    "How satisfied are you with the resources available on campus for addressing homesickness": {
        "category": "Homesickness",
        "answer": (
            "Feeling unsupported for homesickness at college is a lonely experience. "
            "Seek out counsellors specifically trained in transition and adjustment issues, "
            "peer support groups, cultural or regional student associations, and "
            "online communities for students from your region. "
            "Connection — even digital — is one of the most effective antidotes "
            "to the isolation that homesickness creates."
        ),
    },

    "How often do you stay in touch with family and friends from home": {
        "category": "Homesickness",
        "answer": (
            "Staying connected with home while at college is healthy and important. "
            "Establish a predictable communication schedule — it reassures your family "
            "and provides you with emotional anchors throughout the week. "
            "Avoid constant checking-in that keeps you mentally 'at home' when you "
            "should be physically and emotionally engaging with college life."
        ),
    },

    "You hardly ever think about home": {
        "category": "Homesickness",
        "answer": (
            "Being fully absorbed in college life is a very positive sign — it indicates "
            "strong social adjustment and active engagement. Maintain enough connection "
            "with your roots, values, and family relationships even while thriving here. "
            "Balance between embracing your new environment and staying connected to "
            "where you came from creates the most resilient long-term identity."
        ),
    },

    "You call your family so many times during a day": {
        "category": "Homesickness",
        "answer": (
            "Very frequent family calls throughout the day can reinforce homesickness "
            "rather than soothe it, and may also disrupt your academic focus. "
            "Structure calls to twice daily — once in the morning and once in the evening — "
            "at fixed, predictable times. This provides the comfort of connection without "
            "fragmenting your concentration and allowing you to be fully present "
            "in your college environment during the day."
        ),
    },

    "You hate this place": {
        "category": "Homesickness",
        "answer": (
            "Strong negative feelings about your college environment are a significant "
            "distress signal that deserves professional attention, not dismissal. "
            "In the very short term, identify ONE specific aspect of this place that "
            "you can genuinely appreciate or enjoy — even something small. "
            "Long-term, speak with a counsellor about what specific elements are driving "
            "this feeling and create a concrete plan to address them."
        ),
    },

    "You are very excited when vocation is there": {
        "category": "Homesickness",
        "answer": (
            "Strong vacation excitement is perfectly normal and genuinely healthy — "
            "anticipating rest and reconnection with home is a sign you value those things. "
            "Channel that energy by planning productive and restorative vacations: "
            "a skill to develop, a project to complete, genuine rest, and quality family time. "
            "Then return refreshed with renewed motivation for the semester ahead."
        ),
    },

    "How significantly does homesickness affect your mental health": {
        "category": "Homesickness",
        "answer": (
            "Significant homesickness-driven mental health impacts require structured "
            "professional support — not simply more time. Campus counsellors are specifically "
            "trained in transition adjustment difficulties. Building even one genuine friendship "
            "at college is statistically one of the most powerful antidotes to homesickness. "
            "Joining one club, sport, or activity group can be the starting point for that."
        ),
    },

    "How actively do you participate in campus activities to feel more connected": {
        "category": "Homesickness",
        "answer": (
            "Active participation in campus life is the single most effective remedy for "
            "both homesickness and social disconnection. Join at least one club, committee, "
            "sports team, or cultural group this semester. Shared activities create "
            "lasting bonds faster than any other means — and the campus memories you make "
            "through shared experiences are the ones you will value most in retrospect."
        ),
    },

    # ======================================================================
    # CATEGORY 10 : Social Media & Mobile Addiction  (Q84–Q96)
    # ======================================================================

    "You spend so much time on your mobile": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Excessive mobile usage is the most widespread and underestimated productivity "
            "threat in student life today. Use your phone's built-in screen-time tracker "
            "to find your actual daily average — most students are genuinely shocked. "
            "Set a hard daily limit for non-academic use, remove social media apps from "
            "your home screen to reduce passive access, and place the phone face-down in "
            "your bag during study sessions."
        ),
    },

    "Your academic performance has been impacted by any Social media addiction": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Social media addiction that measurably hurts your academic performance is a "
            "serious problem with a concrete solution. Delete your most time-consuming "
            "social media app completely for 30 days and objectively measure the impact "
            "on your grades, focus, and sleep quality. The result of this experiment will "
            "be your most powerful personal motivation for maintaining healthy digital boundaries."
        ),
    },

    "Without any message also you scroll down the screen of your mobile for social media": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Mindless, message-free scrolling is a dopamine-seeking behavior that depletes "
            "attention span, increases background anxiety, and consumes hours invisibly. "
            "Replace this specific habit with a 5-minute alternative whenever you feel "
            "the urge: a glass of water, a brief stretch, three deep breaths, or a short walk. "
            "You will feel more energized and focused after every replacement."
        ),
    },

    "You cannot assume your life without social media sites or apps": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Feeling psychologically unable to exist without social media is a recognized "
            "form of behavioral dependency. Conduct a 48-hour social media detox: the "
            "initial discomfort typically fades within hours and is replaced by a "
            "surprising sense of calm, clarity, and time abundance. This experiment "
            "alone demonstrates that life — and a richer one — does exist beyond the feed."
        ),
    },

    "Your friends comment on your photo or story matter for you a lot": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Relying on social media comments and reactions for self-worth creates a "
            "fragile sense of identity that fluctuates with every notification. "
            "Practice sourcing your daily sense of value from within: keep one promise "
            "to yourself, complete one task, help one person. Your worth is not "
            "quantifiable by likes, comments, or view counts."
        ),
    },

    "You share every happy and sad moment with your friends by posting": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "The impulse to share every emotional experience publicly often stems from "
            "a need for connection, validation, or processing. Try journalling your "
            "feelings privately before posting them. Many students find that private "
            "reflection is more fulfilling, less anxiety-inducing, and more revealing "
            "than public sharing. Save public posts for things you genuinely want "
            "to share — not for emotional processing."
        ),
    },

    "How significantly does your use of mobile phones or social media affect your physical health (e.g., eye strain, posture) problems": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Physical health impacts of excessive screen time — eye strain, poor posture, "
            "neck pain, disrupted sleep from blue light — are cumulative and worsen over time. "
            "Apply the 20-20-20 rule: every 20 minutes, look at something 20 feet away "
            "for 20 seconds. Adjust your screen height to eye level. Invest in a phone "
            "stand and consider blue light filtering glasses for evening use."
        ),
    },

    "Rate your agreement with the statement: My use of mobile phones or social media disrupts my daily life and activities": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "When social media disrupts daily life, routines, and responsibilities, it has "
            "crossed the threshold from tool to dependency. Create non-negotiable phone-free "
            "zones and times: no mobile during meals, no mobile in bed, no mobile during "
            "the first hour after waking. Protecting these three windows alone preserves "
            "significant mental clarity throughout your day."
        ),
    },

    "How often does your use of mobile phones or social media negatively impact your academic performance": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Frequent academic disruption from social media requires structural intervention, "
            "not willpower alone — willpower is finite and depletes by afternoon. "
            "Install website and app blockers (Cold Turkey, Freedom, or Forest) during "
            "designated study sessions. Moving your phone to a different room while studying "
            "has been shown to reduce usage by approximately 30% with no extra effort."
        ),
    },

    "How significantly does your use of mobile phones or social media affect your productivity in academic or personal tasks": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Productivity loss from social media is often completely invisible — you genuinely "
            "do not realize how many hours disappear until you measure them. Track your time "
            "deliberately for one week using a screen-time app. Seeing the actual number "
            "in hours per day is typically one of the most immediately motivating "
            "interventions students can experience."
        ),
    },

    "Have you ever tried to reduce your use of mobile phones or social media": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "If past attempts to reduce usage have consistently failed, the solution is "
            "environmental design rather than increased willpower. Make access structurally "
            "harder: delete apps (re-download only when needed), log out completely after "
            "every session, keep your phone in a designated drawer during study hours. "
            "Friction — not determination — is what reliably reduces impulsive usage."
        ),
    },

    "How anxious do you feel when you are unable to access your mobile phone or social media": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Significant anxiety when separated from your phone is a recognized indicator "
            "of addictive dependency that responds well to gradual exposure therapy. "
            "Deliberately practice 1 hour per day without your phone in a structured setting, "
            "gradually increasing the duration each week. A counsellor can help you structure "
            "this process if the anxiety feels overwhelming or unmanageable."
        ),
    },

    "How often do you use your mobile phone or social media during classes or study sessions": {
        "category": "Social Media & Mobile Addiction",
        "answer": (
            "Mobile use during classes is among the strongest and most consistently documented "
            "predictors of poor academic performance. Enable Do Not Disturb mode during all "
            "class hours, place your phone face-down inside your bag, and commit to this "
            "practice for just two weeks. Students who implement this simple discipline "
            "consistently report significantly better lecture retention and exam scores."
        ),
    },

    # ======================================================================
    # CATEGORY 11 : Mental Health Indicators  (Q97–Q105)
    # ======================================================================

    "Are you sleeping more or less then you normally sleep": {
        "category": "Mental Health Indicators",
        "answer": (
            "Significant changes in your typical sleep pattern — sleeping much more or "
            "much less than usual — are among the primary clinical indicators of depression, "
            "anxiety, and chronic stress. Track your sleep for one week and share this "
            "information with a campus doctor or mental health counsellor. "
            "Changes in sleep are your body's earliest and most reliable distress signal — "
            "pay attention to it."
        ),
    },

    "Do you feel tired, no matter how much you sleep": {
        "category": "Mental Health Indicators",
        "answer": (
            "Persistent fatigue that does not resolve with adequate sleep may indicate "
            "depression, iron deficiency, vitamin D deficiency, thyroid dysfunction, or "
            "chronic stress and anxiety. Do not normalize or dismiss constant tiredness "
            "as a normal part of student life. Schedule a blood test and consult a "
            "doctor within the next two weeks. Most of these causes are highly treatable."
        ),
    },

    "Are you enjoying the things right now happening in your life": {
        "category": "Mental Health Indicators",
        "answer": (
            "Loss of enjoyment in activities you previously found pleasurable — known clinically "
            "as anhedonia — is one of the most significant early warning signs of depression. "
            "If the things that once brought you joy no longer produce any positive feeling, "
            "please speak with a mental health professional without delay. "
            "This is a symptom that responds very well to early, appropriate treatment."
        ),
    },

    "You don't like interaction with anybody": {
        "category": "Mental Health Indicators",
        "answer": (
            "Consistent social withdrawal — choosing isolation even from people you previously "
            "enjoyed — is a common and serious response to depression, anxiety, and overwhelm. "
            "This is your mind signalling that it needs help, not more isolation. "
            "Reach out to one trusted person today and share honestly how you are feeling. "
            "If that feels impossible, contact a campus counsellor or a helpline."
        ),
    },

    "Have you noticed any changes in your physical appearance, such as bloodshot eyes, unusual odors, or sudden weight loss or gain in the past month": {
        "category": "Mental Health Indicators",
        "answer": (
            "Unexpected changes in physical appearance — significant weight change, "
            "persistent eye redness, unusual body odor changes, or skin changes — can "
            "indicate significant physical or mental health distress that the body "
            "is expressing externally. These physical signs often appear before students "
            "consciously recognize the severity of their distress. Consult a doctor promptly "
            "and do not attribute these changes purely to lifestyle without medical evaluation."
        ),
    },

    "It is difficult for you to talk with your friends also": {
        "category": "Mental Health Indicators",
        "answer": (
            "When even communication with close friends becomes difficult, it signals "
            "significant isolation and emotional shutdown that warrants professional support. "
            "Start with the smallest possible reconnection step: a text message checking in, "
            "a brief reply to a message you have been ignoring. Building back to ease of "
            "connection happens incrementally. A counsellor can support you through this process."
        ),
    },

    "Have you noticed any changes in your sleeping patterns or appetite recently": {
        "category": "Mental Health Indicators",
        "answer": (
            "Simultaneous changes in both sleep and appetite are among the most reliable "
            "combined distress signals that clinicians use to assess mental health. "
            "When these two physiological systems shift together, the body is under "
            "significant strain. This combination warrants immediate attention from "
            "a healthcare professional or campus counsellor — please do not wait for "
            "things to get worse before seeking help."
        ),
    },

    "Have you noticed any changes in your academic performance or behavior, such as missing classes or assignments, arriving late, or engaging in disruptive behavior in the past month": {
        "category": "Mental Health Indicators",
        "answer": (
            "Missing classes, consistent late arrivals, incomplete assignments, and behavioral "
            "changes are visible, external manifestations of internal distress that tend to "
            "compound rapidly if not addressed. Speak with your academic advisor and a "
            "counsellor immediately to create a tailored support plan. "
            "Most institutions have academic recovery pathways specifically designed for "
            "students experiencing this — but they work best when accessed early."
        ),
    },

    "How often have you felt disoriented or confused in the past month": {
        "category": "Mental Health Indicators",
        "answer": (
            "Frequent disorientation or confusion can arise from severe sleep deprivation, "
            "extreme stress, substance use, or a developing mental health condition requiring "
            "medical assessment. This symptom should never be ignored or attributed solely "
            "to exam stress. Please consult a campus doctor or mental health professional "
            "as soon as possible. If episodes feel severe or frightening, go to a medical "
            "facility the same day."
        ),
    },
}


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

CATEGORIES: list[str] = list(dict.fromkeys(
    v["category"] for v in QUESTION_ANSWERS.values()
))


def get_answer(question: str) -> dict:
    """Return {category, answer} for the given question text."""
    return QUESTION_ANSWERS.get(question, {
        "category": "General",
        "answer": FALLBACK_ANSWER,
    })


def get_questions_by_category(category: str) -> list[str]:
    """Return all question texts belonging to a category."""
    return [q for q, v in QUESTION_ANSWERS.items() if v["category"] == category]


def list_all_questions() -> list[str]:
    """Return all 105 question texts in order."""
    return list(QUESTION_ANSWERS.keys())
