import { describe, it, expect } from 'vitest'

describe('Example Test Suite', () => {
  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4)
    expect(5 * 3).toBe(15)
    expect(10 - 4).toBe(6)
  })

  it('should handle strings correctly', () => {
    const greeting = 'Hello'
    const name = 'World'
    
    expect(`${greeting} ${name}`).toBe('Hello World')
    expect(greeting.length).toBe(5)
  })

  it('should work with arrays', () => {
    const numbers = [1, 2, 3, 4, 5]
    
    expect(numbers).toHaveLength(5)
    expect(numbers).toContain(3)
    expect(numbers[0]).toBe(1)
  })

  it('should handle objects', () => {
    const person = {
      name: 'John',
      age: 30,
      city: 'New York'
    }
    
    expect(person.name).toBe('John')
    expect(person).toHaveProperty('age')
    expect(person).toEqual({
      name: 'John',
      age: 30,
      city: 'New York'
    })
  })
})
