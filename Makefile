.PHONY: help install dev build start clean lint format type-check test

help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make lint         - Run ESLint"
	@echo "  make format       - Format code with Prettier"
	@echo "  make type-check   - Run TypeScript type checking"
	@echo "  make test         - Run tests"
	@echo "  make clean        - Clean build artifacts"

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

lint:
	pnpm lint

format:
	pnpm format

type-check:
	pnpm type-check

test:
	pnpm test

clean:
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf out
