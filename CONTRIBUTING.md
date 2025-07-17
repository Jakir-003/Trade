# Contributing to CandleBot Trading Assistant

Thank you for your interest in contributing to CandleBot! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and trading concepts

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CandleBot-Trading-Assistant.git
   cd CandleBot-Trading-Assistant
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs
- Use the GitHub issue tracker
- Include a clear description of the bug
- Provide steps to reproduce
- Include browser/system information
- Add screenshots if applicable

### Suggesting Features
- Check existing issues first
- Describe the feature clearly
- Explain the use case and benefits
- Consider implementation complexity

### Code Contributions

#### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Making Changes
1. Create a feature branch from `main`
2. Make your changes following the coding standards
3. Add tests for new functionality
4. Update documentation as needed
5. Commit with clear, descriptive messages

#### Pull Request Process
1. Update the README.md if needed
2. Ensure all tests pass
3. Follow the pull request template
4. Request review from maintainers
5. Address feedback promptly

## 🎯 Development Areas

### High-Priority Contributions
- **Real API Integration**: Connect to live forex data providers
- **Pattern Detection**: Add missing candlestick patterns
- **Technical Indicators**: Implement additional indicators
- **Mobile Optimization**: Improve mobile trading experience
- **Performance**: Optimize real-time data handling

### Good First Issues
- UI/UX improvements
- Documentation updates
- Test coverage improvements
- Code refactoring
- Accessibility enhancements

## 🛠️ Technical Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components focused and reusable

### File Organization
```
client/src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and algorithms
├── pages/          # Page components
└── types/          # TypeScript type definitions

server/
├── routes.ts       # API endpoints
├── storage.ts      # Data management
└── index.ts        # Server setup
```

### Commit Messages
Use conventional commits format:
```
type(scope): description

feat(trading): add stop-loss monitoring
fix(ui): resolve mobile chart rendering
docs(readme): update installation steps
```

### Testing
- Write unit tests for new functions
- Test trading algorithms thoroughly
- Verify WebSocket connections
- Test mobile responsiveness

## 📊 Trading-Specific Guidelines

### Pattern Detection
- Follow established candlestick pattern definitions
- Ensure accuracy before implementation
- Add confidence scoring
- Include pattern validation

### Technical Indicators
- Use proven mathematical formulas
- Handle edge cases (insufficient data)
- Provide clear signal interpretations
- Add parameter customization

### Risk Management
- Never encourage risky trading behavior
- Include appropriate disclaimers
- Validate all financial calculations
- Test edge cases thoroughly

### Data Handling
- Respect API rate limits
- Handle connection failures gracefully
- Implement proper error handling
- Cache data appropriately

## 🔒 Security Considerations

### API Keys
- Never commit API keys
- Use environment variables
- Provide clear setup instructions
- Implement proper validation

### Financial Data
- Ensure data accuracy
- Handle real-time updates properly
- Implement proper error boundaries
- Validate all calculations

## 📝 Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Document complex algorithms
- Explain trading logic clearly
- Include usage examples

### README Updates
- Keep installation steps current
- Update feature lists
- Maintain accurate screenshots
- Update API documentation

## 🧪 Testing Strategy

### Unit Tests
- Test all trading calculations
- Verify pattern detection accuracy
- Test data transformation functions
- Mock external API calls

### Integration Tests
- Test WebSocket connections
- Verify API endpoints
- Test real-time data flow
- Validate UI interactions

### Manual Testing
- Test on multiple devices
- Verify trading workflows
- Check error handling
- Validate mobile experience

## 🎉 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Credited in code comments
- Invited to the contributors channel

## 📞 Getting Help

- Create an issue for questions
- Join discussions in GitHub Discussions
- Review existing documentation
- Ask for clarification in PRs

## 🚫 What Not to Contribute

### Prohibited Contributions
- Gambling or betting features
- Unverified trading strategies
- Proprietary trading algorithms
- Features that encourage excessive risk

### Code Quality Issues
- Code without tests
- Undocumented complex logic
- Breaking changes without migration
- Performance regressions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Focus on technical merit
- Provide constructive feedback
- Help newcomers learn
- Maintain professional communication

### Enforcement
Violations of the code of conduct will result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to the maintainers.

---

**Thank you for contributing to CandleBot! Your efforts help create better trading tools for the community.**