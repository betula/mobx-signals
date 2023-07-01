import { computedFactory, signalFactory } from './signal';

function defineSignalProperty(obj: object, key: PropertyKey, initializer?: () => unknown) {
    const box = initializer 
        ? signalFactory(initializer())
        : signalFactory(undefined);
    
    Object.defineProperty(obj, key, {
        get: box,
        set: box.set
    })
}

export function signalDecorator(_target: object, key: PropertyKey, descriptor: any) {
    const initializer = descriptor.initializer;

    return {
        get() {
            defineSignalProperty(this, key, initializer && initializer.bind(this));
            return this[key];
        },
        set(value: any) {
            defineSignalProperty(this, key, initializer && initializer.bind(this));
            this[key] = value;
        },
    }
}

export function computedDecorator(_target: object, key: PropertyKey, descriptor: any) {
    return {
        get() {
            const box = computedFactory(descriptor.get);

            Object.defineProperty(this, key, { get: box });
            return this[key];
        }
    }
}
