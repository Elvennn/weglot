const assert = require('assert')
const { compute } = require('../src')
const fs = require('fs').promises

describe('compute', () => {
  for (let i = 1; i <= 5; ++i) {
    it(`input ${i} should match output ${i}`, async () => {
      const input = await fs.readFile(`data/input${i}.txt`)
      const computedOutput = compute(input.toString())
      const expectedOutput = (await fs.readFile(`data/output${i}.txt`)).toString()
      assert.equal(computedOutput, expectedOutput)
    })
  }
})
