import { expect, test } from 'bun:test';
import { resolveEffectiveContact } from '../src/lib/domain/effective_contact';
import type { OwnerModel } from '../src/lib/models/owner';

const OWNER: OwnerModel = {
    ownerId: 'OWN1',
    name: 'Yoan Fowas',
    phoneNumber: '998210817',
    whatsapp: true
};

const EXCEPTION = { name: 'Maria José', phoneNumber: '923456789', whatsapp: false };

test('without an exception the effective contact is the main tutor', () => {
    expect(resolveEffectiveContact(OWNER)).toEqual({
        name: OWNER.name,
        phoneNumber: OWNER.phoneNumber,
        whatsapp: OWNER.whatsapp
    });
});

test('with an exception the effective contact is the hospitalization contact', () => {
    expect(resolveEffectiveContact(OWNER, EXCEPTION)).toEqual(EXCEPTION);
});

test('with an exception the tutor is never used, even when it has WhatsApp', () => {
    const contact = resolveEffectiveContact(OWNER, EXCEPTION);

    expect(contact?.phoneNumber).toBe(EXCEPTION.phoneNumber);
    expect(contact?.whatsapp).toBe(false);
});

test('without a tutor and without an exception there is no contact to use', () => {
    expect(resolveEffectiveContact(undefined)).toBeUndefined();
});
