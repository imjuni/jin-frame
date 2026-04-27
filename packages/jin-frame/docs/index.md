---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'jin-frame'
  text: 'Declarative API definition'
  tagline: A reusable, declarative, type-safe, and extendable HTTP request library.
  image:
    src: /assets/jin-frame-brand-icon.png
    alt: jin-frame
  actions:
    - theme: brand
      text: What is Jin-Frame?
      link: /what-is-jin-frame
    - theme: alt
      text: Getting to Start
      link: /getting-to-start
    - theme: alt
      text: Github
      link: https://github.com/imjuni/jin-frame

features:
  - title: Declarative API Definition
    icon: 🎩
    details: Define URL, Querystring, Path Parameters, Body, and Headers intuitively using classes and decorators.
  - title: Type Safety
    icon: ⛑️
    details: Use TypeScript’s type system to detect type mismatches at compile time.
  - title: Support for Retry, Hooks, File Upload, Timeout and Mocking
    icon: 🎢
    details: Provides essential features for real-world usage, including Retry, Hooks, File Upload, Timeout and Mocking.
  - title: Standards-Based HTTP (fetch)
    icon: 🏭
    details: Built on the native fetch API — no third-party HTTP client dependency.
  - title: Path Parameter Support
    icon: 🎪
    details: Supports path parameter substitution via URLs, e.g., example.com/:id.
---
