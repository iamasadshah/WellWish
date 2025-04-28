"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    category: "Care Seekers",
    questions: [
      {
        question: "How do I find a caregiver?",
        answer:
          "Simply create an account, post your care requirements, and browse through verified caregiver profiles. You can filter by location, experience, and services offered.",
      },
      {
        question: "How are caregivers verified?",
        answer:
          "All caregivers undergo thorough background checks, identity verification, and reference checks before being approved on our platform.",
      },
      {
        question: "How does payment work?",
        answer:
          "We use secure payment processing. You can pay through the platform, and funds are released to the caregiver after the service is completed.",
      },
    ],
  },
  {
    category: "Caregivers",
    questions: [
      {
        question: "How do I become a caregiver?",
        answer:
          "Create an account, complete your profile, and submit required documents for verification. Once approved, you can start accepting care requests.",
      },
      {
        question: "What documents do I need?",
        answer:
          "You'll need a valid ID, proof of address, relevant certifications, and references from previous caregiving experience.",
      },
      {
        question: "How do I get paid?",
        answer:
          "Payments are processed through our secure platform. You can set up direct deposit or choose other payment methods.",
      },
    ],
  },
];

export default function FAQ() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
    {}
  );

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text mb-12">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-text">
                  {category.category}
                </h3>
                <FaChevronDown
                  className={`w-5 h-5 text-primary transition-transform ${
                    openCategory === category.category ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openCategory === category.category && (
                <div className="mt-4 space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const questionId = `${categoryIndex}-${questionIndex}`;
                    return (
                      <div
                        key={questionIndex}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                        >
                          <h4 className="text-lg font-medium text-text">
                            {item.question}
                          </h4>
                          <FaChevronDown
                            className={`w-5 h-5 text-primary transition-transform ${
                              openQuestions[questionId] ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openQuestions[questionId] && (
                          <div className="p-4 bg-gray-50">
                            <p className="text-gray-600">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
