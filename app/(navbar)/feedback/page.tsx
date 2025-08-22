'use client';
import { CheckCircle, CircleX, StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    rating: null as number | null,
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    feedback: false,
    rating: false,
  });
  const [submitted, setSubmitted] = useState<boolean | 'failed'>(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: !formData.name,
      email: !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      feedback: !formData.feedback,
      rating: formData.rating === null || formData.rating < 1 || formData.rating > 5,
    };
    setErrors(newErrors);
    if (!newErrors.name && !newErrors.email && !newErrors.feedback && !newErrors.rating) {
      setLoading(true);
      const { name, rating, email, feedback } = formData;
      const url = `https://docs.google.com/forms/d/e/1FAIpQLSfLpykHI6BM14dvcwLgz7E2B0DHyE840UlZI3HX-MZxoaDxYA/formResponse?submit=Submit&usp=pp_url&entry.979116687=${encodeURIComponent(rating as number)}&entry.1768585926=${encodeURIComponent(name)}&entry.711917196=${encodeURIComponent(email)}&entry.2088696203=${encodeURIComponent(feedback)}`;
      fetch(url, { mode: 'no-cors', method: 'POST' })
        .then(() => {
          setFormData({ name: '', email: '', feedback: '', rating: null });
          setLoading(false);
          setSubmitted(true);
        })
        .catch(error => {
          console.error('Error:', error);
          toast('Message failed to send', {
            cancel: { label: 'Close', onClick() {} },
            description: 'Please try again later',
            icon: <CircleX color='red' size={16} />,
          });
          setFormData({ name: '', email: '', feedback: '', rating: null });
          setLoading(false);
        });
    }
  };

  const nameId = useId();
  const emailId = useId();
  const feedbackId = useId();

  return (
    <div className='w-full max-w-5xl my-8 mx-auto'>
      <Card className='border grid md:grid-cols-2'>
        <div>
          <CardHeader>
            <CardTitle className='text-lg'>We Value Your Feedback</CardTitle>
            <CardDescription>Help us improve our tools by sharing your thoughts</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            {submitted ? (
              submitted !== 'failed' ? (
                <div className='flex flex-col items-center justify-center py-6 text-center space-y-4'>
                  <div className='rounded-full bg-teal-100 p-3 dark:bg-teal-900/30'>
                    <CheckCircle className='h-8 w-8 text-teal-600 dark:text-teal-400' />
                  </div>
                  <h3 className='text-xl font-medium'>Thank You!</h3>
                  <p className='text-muted-foreground'>Your feedback has been submitted successfully.</p>
                  <Button
                    variant='outline'
                    className='mt-4 border hover:text-gray-600 text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-900/20'
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Response
                  </Button>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-6 text-center space-y-4'>
                  <div className='rounded-full bg-red-100 p-3 dark:bg-red-900/30'>
                    <CircleX className='h-8 w-8 text-red-600 dark:text-red-400' />
                  </div>
                  <h3 className='text-xl font-medium'>Submission Failed</h3>
                  <p>Please try submitting your feedback using the alternative form.</p>
                  <Link href='https://forms.gle/qtNssDeVEW24gRVg8' target='_blank' className='text-accent underline'>
                    Open Alternative Form
                  </Link>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor={nameId}>
                    Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id={nameId}
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Your name'
                    className={cn(errors.name ? 'border-red-500' : '')}
                  />
                  {errors.name && <p className='text-red-500 text-xs'>Name is required</p>}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor={emailId}>
                    Email <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id={emailId}
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='your.email@example.com'
                    className={cn(errors.email ? 'border-red-500' : '')}
                  />
                  {errors.email && <p className='text-red-500 text-xs'>Valid email is required</p>}
                </div>
                <div className='space-y-2'>
                  <Label>
                    Rating <span className='text-red-500'>*</span>
                  </Label>
                  <div className='flex items-center space-x-1'>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type='button'
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, rating: star }));
                          setErrors(prev => ({ ...prev, rating: false }));
                        }}
                        className='focus:outline-hidden p-1'
                      >
                        <StarIcon
                          size={28}
                          fill={formData.rating && star <= formData.rating ? '#FFD700' : 'none'}
                          stroke='#FFD700'
                          strokeWidth={2}
                          className='hover:fill-yellow-500 hover:stroke-yellow-500 transition-colors duration-200'
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && <p className='text-red-500 text-xs'>Rating is required (1-5)</p>}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor={feedbackId}>
                    Feedback <span className='text-red-500'>*</span>
                  </Label>
                  <Textarea
                    id={feedbackId}
                    name='feedback'
                    value={formData.feedback}
                    onChange={handleChange}
                    placeholder='Please share your thoughts about our tool...'
                    className={cn('min-h-[120px]', errors.feedback ? 'border-red-500' : '')}
                  />
                  {errors.feedback && <p className='text-red-500 text-xs'>Feedback is required</p>}
                </div>
              </form>
            )}
          </CardContent>
          {!submitted && (
            <CardFooter>
              <Button onClick={handleSubmit} className='w-full'>
                {loading && <Spinner variant={1} className='text-white mr-2' size={'small'} />}
                Submit Feedback
              </Button>
            </CardFooter>
          )}
        </div>
        <Image
          src='/image/feedback.png'
          alt='Feedback'
          width={500}
          height={500}
          priority
          className='hidden md:block object-cover rounded-r-lg w-full h-full'
        />
      </Card>
    </div>
  );
}
