---
name: Improvement PR
about: Template for improvements and enhancements
title: "[DEV/MAIN-IMP] <short description of the improvement>"
ai agent instructions:
  - definitions: 
    - new commits : meaning the diff commits between the current branch and the target branch, this DOES NOT INCLUDE merge requests showing in the commits
  - when creating a new PR with this template follow these instructions :
      - The new commits messages are your most important source of information, prompt and files are next in importance.
      - get the last new commits only and craft a general title
      - extract the Improvements and add each one in a separate lines, the improvement should be summarized and a minimal number of lines.
      - When creating improvements, choose one of the given labels (the labels between parenthesis) based on the context of the commits and update the [improvement] prefix with the label chosen
      - When creating notes, each subject should have only 1 note, do not spread them across multiple notes
      - When creating note, choose one of the given labels (the labels between parenthesis) based on the context of the commits
      - When no tests are mentioned in the commit context, do not add anything to the testing section
      - When no extra context is mentioned in the prompt, do not add anything to the context section
---

## **Improvements:**
- [Improvement] (refactoring, performance optimization, code quality, etc.) : Describe your improvements

[//]: # (<-- ONLY AS Example : [Improvement] : Adding a new endpint to manage X !>)
[//]: # (<-- ONLY AS Example : [refactoring] : Refactored the X components to be used in A,B,C components !>)
[//]: # (<-- ONLY AS Example : [optimization] : Introduced a new library that will better handle our X feature !>)


## **Notes**

any notes, opinions, mention, impact :

- [Note] (notes, opinions, mention, impact, dependency) : describe your note

[//]: # (<-- ONLY AS Example : [Note] : The new feature is only available for such use cases !>)
[//]: # (<-- ONLY AS Example : [Mention] : A new library X is also being eyed as a replacement for our Y implementation !>)
[//]: # (<-- ONLY AS Example : [impact] : This update will impact the Y of X !>)


## **How Has This Been Tested?**

Describe the testing performed:

- Test cases added
- Manual testing performed
- Integration testing
- Test results


## **Related Issues**


## **Screenshots (if applicable)**


## **Additional Context**

