/** E2E tests for test-app harness (Board Game Engine React) – game selector and local mode. */
import { test, expect } from './coverage.js'

const HARNESS_URL = '/'

test.describe('Harness', () => {
  test('harness loads with title and game selector', async ({ page }) => {
    await page.goto(HARNESS_URL, { waitUntil: 'load' })
    await expect(page.getByTestId('harness-title')).toHaveText(/Board Game Engine React/i)
    await expect(page.getByTestId('game-select')).toHaveValue('tic-tac-toe')
    await expect(page.getByTestId('start-btn')).toHaveText(/Start \/ Reset Game/i)
  })

  test('can select different games from dropdown', async ({ page }) => {
    await page.goto(HARNESS_URL, { waitUntil: 'load' })
    await page.getByTestId('game-select').selectOption('connect-four')
    await expect(page.getByTestId('game-select')).toHaveValue('connect-four')
    await page.getByTestId('game-select').selectOption('reversi')
    await expect(page.getByTestId('game-select')).toHaveValue('reversi')
  })

  test('can start tic-tac-toe in local mode', async ({ page }) => {
    await page.goto(HARNESS_URL, { waitUntil: 'load' })
    await expect(page.getByTestId('game-select')).toHaveValue('tic-tac-toe')
    await page.getByTestId('start-btn').click()
    await expect(page.getByTestId('start-btn')).not.toHaveText(/Loading/)
    await expect(page.getByTestId('harness-game').locator('.game')).toBeVisible({ timeout: 5000 })
  })

  test('can start connect-four and see game', async ({ page }) => {
    await page.goto(HARNESS_URL, { waitUntil: 'load' })
    await page.getByTestId('game-select').selectOption('connect-four')
    await page.getByTestId('start-btn').click()
    await expect(page.getByTestId('harness-game').locator('.game')).toBeVisible({ timeout: 5000 })
    await expect(page.getByTestId('harness-game').locator('.shared-board')).toBeAttached()
  })

  test('tic-tac-toe shows game content after start', async ({ page }) => {
    await page.goto(HARNESS_URL, { waitUntil: 'load' })
    await page.getByTestId('start-btn').click()
    const gameArea = page.getByTestId('harness-game').locator('.game')
    await expect(gameArea).toBeVisible({ timeout: 5000 })
    await expect(gameArea.locator('.grid, .shared-board').first()).toBeAttached({ timeout: 3000 })
  })

  test('tic-tac-toe: click one space and an entity appears in that space', async ({ page }) => {
    await page.goto(HARNESS_URL, { waitUntil: 'load' })
    await page.getByTestId('start-btn').click()
    const gameArea = page.getByTestId('harness-game').locator('.game')
    await expect(gameArea).toBeVisible({ timeout: 5000 })
    const cells = gameArea.locator('.grid__cell')
    await expect(cells).toHaveCount(9, { timeout: 3000 })
    const firstCell = cells.nth(0)
    await firstCell.locator('.space').first().click()
    await expect(firstCell.locator('.entity')).toBeVisible({ timeout: 2000 })
  })

  test('plays a full game of tic-tac-toe and game ends', async ({ page }) => {
    await page.goto(HARNESS_URL, { waitUntil: 'load' })
    await page.getByTestId('start-btn').click()
    const gameArea = page.getByTestId('harness-game').locator('.game')
    await expect(gameArea).toBeVisible({ timeout: 5000 })
    await expect(gameArea.locator('.grid__cell')).toHaveCount(9, { timeout: 3000 })
    const moveOrder = [0, 3, 1, 4, 2]
    for (const index of moveOrder) {
      const cell = gameArea.locator('.grid__cell').nth(index)
      await cell.locator('.space').first().click()
      await page.waitForTimeout(200)
    }
    await expect(gameArea.locator('.game-status')).toBeVisible({ timeout: 5000 })
    await expect(gameArea.locator('.game-status')).toHaveText(/Wins!|Draw!/)
  })
})
