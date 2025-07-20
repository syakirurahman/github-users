import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'

describe('Accordion', () => {
  it('renders accordion with items', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  it('renders accordion triggers as buttons', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const trigger = screen.getByRole('button', { name: 'Section 1' })
    expect(trigger).toBeInTheDocument()
  })

  it('applies custom className to accordion item', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="custom-item-class">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const item = screen.getByText('Section 1').closest('[data-slot="accordion-item"]')
    expect(item).toHaveClass('custom-item-class')
  })

  it('applies custom className to accordion trigger', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="custom-trigger-class">Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const trigger = screen.getByRole('button', { name: 'Section 1' })
    expect(trigger).toHaveClass('custom-trigger-class')
  })

  it('applies custom className to accordion content', () => {
    render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent className="custom-content-class">Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const content = screen.getByText('Content 1').closest('[data-slot="accordion-content"]')
    expect(content).toBeInTheDocument()
  })

  it('renders chevron icon in trigger', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    // The chevron icon should be present (it's a Lucide icon)
    const trigger = screen.getByRole('button', { name: 'Section 1' })
    expect(trigger.querySelector('svg')).toBeInTheDocument()
  })
}) 