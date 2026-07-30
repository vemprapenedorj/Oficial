import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ACCEPTED_CONSENT,
  REJECTED_CONSENT,
  createCustomConsent,
} from '../consent';

test('aceitar todos concede todos os sinais do Consent Mode', () => {
  assert.deepEqual(ACCEPTED_CONSENT, {
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
    security_storage: 'granted',
  });
});

test('recusar mantém apenas security_storage concedido', () => {
  assert.deepEqual(REJECTED_CONSENT, {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
  });
});

test('preferências concedem apenas as categorias selecionadas', () => {
  assert.deepEqual(createCustomConsent({ analytics: true, marketing: false, preferences: true }), {
    ad_storage: 'denied',
    analytics_storage: 'granted',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
    security_storage: 'granted',
  });
});
