import { getDb } from '../config/jest/helper'

it('update with promise', async () => {
  const db = await getDb()
  const items0 = await db.findAsync({})

  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({})

  const maggie1 = await db.findOneAsync({ name: 'Maggie' })
  const bob1 = await db.findOneAsync({ name: 'Bob' })

  await db.updateAsync({ name: { $in: ['Maggie', 'Bob'] } }, { $set: { age: 1 } }, { multi: true })

  const maggie2 = await db.findOneAsync({ name: 'Maggie' })
  const bob2 = await db.findOneAsync({ name: 'Bob' })

  expect(items0).toHaveLength(0)
  expect(items).toHaveLength(2)
  expect(maggie1.age).toBeUndefined()
  expect(bob1.age).toBeUndefined()
  expect(bob2.age).toEqual(1)
  expect(maggie2.age).toEqual(1)
})

it('update with callback', async done => {
  const db = await getDb()
  const items0 = await db.findAsync({})

  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({})

  const maggie1 = await db.findOneAsync({ name: 'Maggie' })
  const bob1 = await db.findOneAsync({ name: 'Bob' })

  db.update({ name: { $in: ['Maggie', 'Bob'] } }, { $set: { age: 1 } }, { multi: true }, async function(err, res) {
    const maggie2 = await db.findOneAsync({ name: 'Maggie' })
    const bob2 = await db.findOneAsync({ name: 'Bob' })

    expect(res).toEqual(2)
    expect(items0).toHaveLength(0)
    expect(items).toHaveLength(2)
    expect(maggie1.age).toBeUndefined()
    expect(bob1.age).toBeUndefined()
    expect(bob2.age).toEqual(1)
    expect(maggie2.age).toEqual(1)
    done()
  })
})

it('remove with callback', async done => {
  const db = await getDb()
  const items0 = await db.findAsync({})

  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({})

  db.remove({ name: { $in: ['Bob'] } }, { multi: true }, async function(err, res) {
    const bob2 = await db.findOneAsync({ name: 'Bob' })

    expect(res).toEqual(1)
    expect(items0).toHaveLength(0)
    expect(items).toHaveLength(2)
    expect(bob2).toBeNull()
    done()
  })
})

it('resolve remove nonexistent', async done => {
  const db = await getDb()
  const items0 = await db.findAsync({})

  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({})

  db.remove({ name: 'nonexistent' }, { multi: true }, async function(err, res) {
    const nonexistent = await db.findOneAsync({ name: 'nonexistent' })

    expect(res).toEqual(0)
    expect(items0).toHaveLength(0)
    expect(items).toHaveLength(2)
    expect(nonexistent).toBeNull()
    done()
  })
})

it('resolve findOne nonexistent', async () => {
  const db = await getDb()
  await db.insertAsync({ name: 'Maggie' })
  await db.insertAsync({ name: 'Bob' })

  const items = await db.findAsync({ name: 'nonexistent' })

  const item = await db.findOneAsync({ name: 'nonexistent' }, function() {})

  expect(item).toBeNull()
  expect(items.length).toEqual(0)
})


it('should limit', async (done) => {
  const db = await getDb()
  await db.insertAsync({ name: 'A' })
  await db.insertAsync({ name: 'B' })
  await db.insertAsync({ name: 'C' })
  await db.insertAsync({ name: 'D' })

  db.find({}).sort({ name: 1 }).skip(1).limit(2).exec(function (err, docs) {
    expect(docs.length).toEqual(2)
    expect(docs[1].name).toEqual('C')
    done()
  });
})

it('should limit async', async (done) => {
  const db = await getDb()
  await db.insertAsync({ name: 'A' })
  await db.insertAsync({ name: 'B' })
  await db.insertAsync({ name: 'C' })
  await db.insertAsync({ name: 'D' })

  const docs = await db.find({}).sort({ name: 1 }).skip(1).limit(2).exec();
  expect(docs.length).toEqual(2)
  expect(docs[1].name).toEqual('C')
  done()
})
