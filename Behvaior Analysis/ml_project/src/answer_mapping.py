"""
answer_mapping.py
=================
Predefined, deterministic answer store keyed by predicted job-role class.

Rules
-----
* NO dynamic answer generation.
* Every class must have exactly one answer entry.
* Unknown / unmapped classes fall back to FALLBACK_ANSWER.
* This module has zero ML dependencies – import it anywhere.

Dataset context
---------------
The classifier was trained on ~57 000 resampled samples of the
`mldata.csv` dataset (originally ~6 900 rows).  The 12 unique target
labels found in the dataset are listed as the keys below.
"""

from __future__ import annotations

# ---------------------------------------------------------------------------
# Fallback answer returned when the predicted class is not in the mapping.
# This covers future model updates that may introduce new class labels.
# ---------------------------------------------------------------------------
FALLBACK_ANSWER: str = (
    "We could not determine a specific career recommendation for your profile. "
    "Please consult an academic or career adviser for personalised guidance."
)

# ---------------------------------------------------------------------------
# Core mapping: class label → predefined human-readable answer
# ---------------------------------------------------------------------------
# All 12 classes discovered in mldata.csv / resampled_data.csv are covered.
ANSWER_MAP: dict[str, str] = {
    # ------------------------------------------------------------------ 0
    "Applications Developer": (
        "You are well-suited to become an Applications Developer. "
        "This role involves designing, coding, testing, and maintaining software "
        "applications for desktops, web browsers, or enterprise systems. "
        "Focus on strengthening your programming fundamentals (Python, Java, C#), "
        "learn a modern application framework (React, Spring Boot, .NET), "
        "and build a portfolio of end-to-end projects to stand out to employers."
    ),
    # ------------------------------------------------------------------ 1
    "CRM Technical Developer": (
        "Your profile matches a CRM Technical Developer career. "
        "You would work with Customer Relationship Management platforms such as "
        "Salesforce, Microsoft Dynamics 365, or HubSpot—customising workflows, "
        "building integrations, and writing automation scripts. "
        "Pursue a CRM vendor certification (e.g., Salesforce Certified Platform Developer), "
        "practise Apex or Power Automate, and develop strong SQL skills for data migration tasks."
    ),
    # ------------------------------------------------------------------ 2
    "Database Developer": (
        "A career as a Database Developer is an excellent match for you. "
        "You will design schemas, write optimised queries, build stored procedures, "
        "and manage data pipelines for relational and NoSQL databases. "
        "Master SQL deeply (window functions, indexing strategies, query plans), "
        "then expand to PostgreSQL or SQL Server certifications, "
        "and learn ETL tooling such as dbt or Apache Airflow for modern data workflows."
    ),
    # ------------------------------------------------------------------ 3
    "Mobile Applications Developer": (
        "You are best suited for a Mobile Applications Developer role. "
        "You will build and maintain apps for iOS (Swift/SwiftUI) and/or "
        "Android (Kotlin/Jetpack Compose), or use cross-platform frameworks "
        "such as Flutter or React Native. "
        "Publish at least two apps to the App Store or Google Play, "
        "learn mobile UX/UI principles, and practise integrating REST APIs, "
        "push notifications, and device sensors into your projects."
    ),
    # ------------------------------------------------------------------ 4
    "Network Security Engineer": (
        "Your skills and interests align with a Network Security Engineer career. "
        "This role involves protecting organisational infrastructure through firewall "
        "management, intrusion detection, vulnerability assessments, and incident response. "
        "Pursue industry certifications such as CompTIA Security+, CEH, or CISSP, "
        "practise on platforms like TryHackMe or Hack The Box, "
        "and deepen your knowledge of TCP/IP, VPNs, zero-trust architecture, and SIEM tools."
    ),
    # ------------------------------------------------------------------ 5
    "Software Developer": (
        "You have a strong aptitude for a Software Developer role. "
        "Software Developers contribute across the entire product lifecycle—"
        "gathering requirements, designing solutions, writing clean code, "
        "and collaborating in agile teams. "
        "Build fluency in at least one backend language (Python, Go, or Java), "
        "understand data structures and algorithms, adopt version control (Git) best practices, "
        "and contribute to open-source projects to grow your professional network."
    ),
    # ------------------------------------------------------------------ 6
    "Software Engineer": (
        "You are well-positioned for a Software Engineer career. "
        "Software Engineers apply engineering principles to large-scale system design, "
        "scalability, reliability, and performance—going beyond coding to architecture "
        "and cross-team technical leadership. "
        "Study system design patterns (microservices, event-driven architectures), "
        "practise LeetCode-style problem solving, obtain a cloud platform certification "
        "(AWS/Azure/GCP), and seek internships that expose you to production-grade codebases."
    ),
    # ------------------------------------------------------------------ 7
    "Software Quality Assurance (QA) / Testing": (
        "Your profile is a strong fit for a Software QA / Testing career. "
        "QA Engineers safeguard product quality by designing test plans, writing "
        "automated test suites, performing exploratory testing, and advocating for "
        "quality throughout the development cycle. "
        "Learn Selenium or Playwright for UI automation, pytest or JUnit for unit/integration tests, "
        "and familiarise yourself with CI/CD pipelines (GitHub Actions, Jenkins). "
        "ISTQB Foundation certification will strengthen your credentials."
    ),
    # ------------------------------------------------------------------ 8
    "Systems Security Administrator": (
        "A Systems Security Administrator role is the right career path for you. "
        "You will be responsible for hardening servers and endpoints, managing access controls, "
        "conducting security audits, and responding to threats across on-premises and "
        "cloud environments. "
        "Study operating system security (Linux hardening, Windows Server policies), "
        "learn scripting for automation (Bash, PowerShell), "
        "and pursue certifications such as CompTIA CySA+ or Microsoft SC-200 to validate your expertise."
    ),
    # ------------------------------------------------------------------ 9
    "Technical Support": (
        "Your strengths make you an excellent candidate for a Technical Support role. "
        "Technical Support professionals diagnose hardware and software issues, "
        "resolve user queries efficiently, document known problems, and escalate complex "
        "cases to development teams. "
        "Build expertise in operating system troubleshooting, networking basics (DNS, DHCP, TCP/IP), "
        "and ITSM tools like ServiceNow or Jira Service Management. "
        "CompTIA A+ is the standard entry-level certification for this path."
    ),
    # ------------------------------------------------------------------ 10
    "UX Designer": (
        "Your profile indicates a natural fit for a UX Designer career. "
        "UX Designers research user needs, create user journeys and wireframes, "
        "prototype interfaces, and validate designs through usability testing. "
        "Develop proficiency in Figma or Adobe XD, study Nielsen's usability heuristics, "
        "and build a case-study portfolio demonstrating your design thinking process "
        "from problem discovery through to iteration based on real user feedback."
    ),
    # ------------------------------------------------------------------ 11
    "Web Developer": (
        "You are well-matched for a Web Developer career. "
        "Web Developers build and maintain websites and web applications, "
        "working across front-end (HTML, CSS, JavaScript/TypeScript) and/or "
        "back-end (Node.js, Django, Laravel) technology stacks. "
        "Master responsive design and accessibility (WCAG) principles, "
        "learn a modern front-end framework (React or Vue), "
        "understand REST and GraphQL API design, "
        "and deploy projects on cloud platforms to demonstrate real-world readiness."
    ),
}

# ---------------------------------------------------------------------------
# Public interface
# ---------------------------------------------------------------------------

def get_answer(predicted_class: str) -> str:
    """
    Return the predefined answer for *predicted_class*.

    Parameters
    ----------
    predicted_class:
        The class label string returned by the classifier.

    Returns
    -------
    str
        A deterministic, human-readable answer.  Falls back to
        FALLBACK_ANSWER if the class is not found in ANSWER_MAP.
    """
    return ANSWER_MAP.get(predicted_class, FALLBACK_ANSWER)


def list_classes() -> list[str]:
    """Return all class labels that have a predefined answer."""
    return list(ANSWER_MAP.keys())


def is_known_class(predicted_class: str) -> bool:
    """Return True if *predicted_class* has a predefined answer."""
    return predicted_class in ANSWER_MAP
