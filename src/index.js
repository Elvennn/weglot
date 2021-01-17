const nonWorkSlots = (day) => ([
  {
    day,
    start: '00:00',
    end: '07:59'
  },
  {
    day,
    start: '18:00',
    end: '23:59'
  }
])

function compute (input) {
  const slots = input.split('\n').map(line => parseSlot(line))
  for (let day = 1; day < 6; ++day) {
    const slotsOfDay = slots.filter(slot => slot.day === day)
    let mergedSlots = slotsOfDay
    let previousSlotsCount = 0
    while (mergedSlots.length !== 1 && previousSlotsCount !== mergedSlots.length) {
      previousSlotsCount = mergedSlots.length
      mergedSlots = nextMerge(mergedSlots)
    }
    const optimizedNonAvailableSlots = [
      ...mergedSlots,
      ...nonWorkSlots(day)
    ]
    const resultSlot = findFree60MinutesSlot(optimizedNonAvailableSlots.sort((slot1, slot2) => slot1.start > slot2.start ? 1 : -1))
    if (resultSlot) {
      return `${resultSlot.day} ${resultSlot.start}-${resultSlot.end}`
    }
  }
}

function nextMerge (slots) {
  for (let i = 0; i < slots.length; ++i) {
    for (let j = 0; j < slots.length; ++j) {
      const slot1 = slots[i]
      const slot2 = slots[j]
      if (slot1 === slot2) continue
      const mergedSlot = tryMerge(slot1, slot2)
      if (mergedSlot) {
        const [min, max] = i > j ? [j, i] : [i, j]
        // Removing highest index first to preserve order.
        // TODO Might be a clean solution for this
        slots.splice(max, 1)
        slots.splice(min, 1, mergedSlot)
        return slots
      }
    }
  }
  return slots
}

function parseSlot (line) {
  const t = line.split(' ')
  const day = parseInt(t[0])
  const slotTime = t[1].split('-')
  return {
    day,
    start: slotTime[0],
    end: slotTime[1]
  }
}

function tryMerge (slot1, slot2) {
  if (slot1.day !== slot2.day) {
    throw new Error('Cannot merge slots on different days')
  }
  const firstSlot = slot1.start > slot2.start ? slot2 : slot1
  const lastSlot = firstSlot === slot1 ? slot2 : slot1

  if (lastSlot.start < firstSlot.end) {
    return {
      day: slot1.day,
      start: firstSlot.start,
      end: firstSlot.end > lastSlot.end ? firstSlot.end : lastSlot.end
    }
  }
}

function findFree60MinutesSlot (orderedOccupiedSlots) {
  for (let i = 1; i < orderedOccupiedSlots.length; ++i) {
    const slot1 = orderedOccupiedSlots[i - 1]
    const slot2 = orderedOccupiedSlots[i]
    if (addToTime(slot1.end, 60) < slot2.start) {
      return {
        day: slot1.day,
        start: addToTime(slot1.end, 1),
        end: addToTime(slot1.end, 60)
      }
    }
  }
}

function addToTime (time, minuntesToAdd) {
  const [hours, minutes] = time.split(':')
  const newMinutes = parseInt(minutes) + minuntesToAdd
  const newHours = parseInt(hours) + (Math.floor(newMinutes / 60))
  return `${formatStringInt(newHours)}:${formatStringInt(newMinutes % 60)}`
}

function formatStringInt (int) {
  return int < 10 ? '0' + int : int
}

module.exports = {
  compute
}
