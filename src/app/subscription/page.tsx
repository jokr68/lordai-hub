'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function SubscriptionPage() {
  const { t, language } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: t('subscription_free'),
      price: 0,
      features: [
        t('subscription_features_basicChat'),
        t('subscription_features_limitedCharacters'),
        t('subscription_features_basicMemory'),
        t('subscription_features_standardSupport'),
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: t('subscription_premium'),
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      features: [
        t('subscription_features_unlimitedChat'),
        t('subscription_features_unlimitedCharacters'),
        t('subscription_features_advancedMemory'),
        t('subscription_features_prioritySupport'),
        t('subscription_features_voiceChat'),
        t('subscription_features_imageUpload'),
        t('subscription_features_analytics'),
      ],
      popular: true,
    },
    {
      id: 'creator',
      name: t('subscription_creator'),
      price: billingCycle === 'monthly' ? 29.99 : 299.99,
      features: [
        t('subscription_features_allPremium'),
        t('subscription_features_characterMarketplace'),
        t('subscription_features_revenueSharing'),
        t('subscription_features_customAPI'),
        t('subscription_features_whiteLabel'),
        t('subscription_features_dedicatedSupport'),
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('subscription_title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t('subscription_subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('subscription_monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('subscription_yearly')}
              <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                {t('subscription_save20')}
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all hover:scale-105 ${
                plan.popular ? 'ring-4 ring-purple-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 font-semibold">
                  {t('subscription_mostPopular')}
                </div>
              )}

              <div className="p-8 pt-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{billingCycle === 'monthly' ? t('subscription_month') : t('subscription_year')}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.id === 'free' ? t('subscription_currentPlan') : t('subscription_upgrade')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            {t('subscription_faq_title')}
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t('subscription_faq_q1')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('subscription_faq_a1')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t('subscription_faq_q2')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('subscription_faq_a2')}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t('subscription_faq_q3')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('subscription_faq_a3')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}